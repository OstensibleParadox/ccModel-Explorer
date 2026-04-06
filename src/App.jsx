import { useEffect, useMemo, useState } from 'react';
import commonLawEstates from './data/commonLawEstates.json';
import civilLawEstates from './data/civilLawEstates.json';
import harmonizationData from './data/harmonization.json';
import harmonizationInstruments from './data/harmonizationInstruments.json';
import LanguageSwitcher from './components/LanguageSwitcher';
import ModeSwitcher from './components/ModeSwitcher';
import SliderPanel from './components/SliderPanel';
import DualTrackView from './components/DualTrackView';
import ViolationAlert from './components/ViolationAlert';
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  detectLocale,
  getIntlEconomicSliderMeta,
  getLanguageOption,
  getSliderMeta,
  getUiCopy,
  isSupportedLocale,
  localizeCommonLawEstate,
  localizeCivilLawEstate,
  localizeConvergenceResult,
  localizeSliderAnnotation,
  localizeViolation,
} from './i18n';
import { computeConvergence } from './utils/convergenceEngine';
import { computeCivilMatches, SLIDER_KEYS } from './utils/matchEngine';
import {
  computeCommonLawMatches,
} from './utils/commonLawResolver';
import { localizeInstrument } from './utils/instrumentLocalization';
import { getSliderAnnotations } from './utils/jurisdictionResolver';
import { checkViolations, computeSliderBounds } from './utils/violationRules';
import { filterInstruments } from './utils/instrumentEngine';
import './App.css';

const MATCH_THRESHOLD = 0.5;
const INITIAL_VALUES = Object.fromEntries(SLIDER_KEYS.map((key) => [key, 50]));
const INITIAL_SLIDER_LOCKS = Object.fromEntries(
  SLIDER_KEYS.map((key) => [key, { enabled: false, threshold: null }])
);

const DOCUMENT_TITLES = {
  en: 'ccModel Explorer',
  zh: 'ccModel Explorer | 简体中文',
  de: 'ccModel Explorer | Deutsch',
  ja: 'ccModel Explorer | 日本語',
};

function resolveInitialLocale() {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);

  if (isSupportedLocale(storedLocale)) {
    return storedLocale;
  }

  return detectLocale(window.navigator.languages ?? [window.navigator.language]);
}

function clampSliderValues(nextValues, sliderBounds) {
  return Object.fromEntries(
    SLIDER_KEYS.map((key) => {
      const bounds = sliderBounds[key] ?? { min: 0, max: 100 };
      const nextValue = nextValues[key];

      return [key, Math.min(bounds.max, Math.max(bounds.min, nextValue))];
    })
  );
}

function normalizeThreshold(value, fallbackValue) {
  const parsed = Number(value);
  const safeValue = Number.isFinite(parsed) ? parsed : fallbackValue;
  return Math.min(100, Math.max(0, Math.round(safeValue)));
}

function App() {
  const [locale, setLocale] = useState(resolveInitialLocale);
  const [mode, setMode] = useState('property');
  const [sliderValues, setSliderValues] = useState(INITIAL_VALUES);
  const [sliderLocks, setSliderLocks] = useState(INITIAL_SLIDER_LOCKS);
  const [activeCommonLawJurisdiction, setActiveCommonLawJurisdiction] =
    useState(null);
  const [activeCivilJurisdiction, setActiveCivilJurisdiction] = useState(null);
  const [activeAssetType, setActiveAssetType] = useState(null);

  const ui = useMemo(() => getUiCopy(locale), [locale]);
  const propertySliderMeta = useMemo(() => getSliderMeta(locale), [locale]);
  const intlEconomicSliderMeta = useMemo(
    () => getIntlEconomicSliderMeta(locale),
    [locale]
  );
  const sliderMeta =
    mode === 'intl' ? intlEconomicSliderMeta : propertySliderMeta;
  const languageOption = useMemo(() => getLanguageOption(locale), [locale]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.lang = languageOption.htmlLang;
    document.title = DOCUMENT_TITLES[locale] ?? DOCUMENT_TITLES.en;
  }, [languageOption, locale]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  const localizedCommonLawEstates = useMemo(() => {
    return commonLawEstates.map((estate) =>
      localizeCommonLawEstate(estate, locale)
    );
  }, [locale]);

  const localizedCivilLawEstates = useMemo(() => {
    return civilLawEstates.map((estate) => localizeCivilLawEstate(estate, locale));
  }, [locale]);

  function handleCommonLawJurisdictionChange(jurisdiction) {
    setActiveCommonLawJurisdiction((currentJurisdiction) =>
      currentJurisdiction === jurisdiction ? null : jurisdiction
    );
  }

  function handleCivilJurisdictionChange(jurisdiction) {
    const nextJurisdiction =
      activeCivilJurisdiction === jurisdiction ? null : jurisdiction;

    setActiveCivilJurisdiction(nextJurisdiction);

    if (nextJurisdiction !== 'prc') {
      setActiveAssetType(null);
    }
  }

  function handleAssetTypeChange(assetType) {
    setActiveAssetType((currentAssetType) =>
      currentAssetType === assetType ? null : assetType
    );
  }

  function handleModeChange(nextMode) {
    setMode(nextMode);
  }

  function handleSliderChange(nextValues) {
    setSliderValues((currentValues) => {
      const resolvedValues =
        typeof nextValues === 'function' ? nextValues(currentValues) : nextValues;
      const nextBounds = computeSliderBounds(resolvedValues, sliderLocks);

      return clampSliderValues(resolvedValues, nextBounds);
    });
  }

  function handleSliderLockToggle(key, enabled, fallbackThreshold) {
    setSliderLocks((currentLocks) => {
      const currentLock = currentLocks[key] ?? {
        enabled: false,
        threshold: null,
      };
      const threshold = normalizeThreshold(
        currentLock.threshold,
        fallbackThreshold
      );
      const nextLocks = {
        ...currentLocks,
        [key]: {
          enabled,
          threshold,
        },
      };

      setSliderValues((currentValues) =>
        clampSliderValues(currentValues, computeSliderBounds(currentValues, nextLocks))
      );

      return nextLocks;
    });
  }

  function handleSliderLockThresholdChange(key, threshold) {
    setSliderLocks((currentLocks) => {
      const currentLock = currentLocks[key] ?? {
        enabled: false,
        threshold: null,
      };
      const nextLocks = {
        ...currentLocks,
        [key]: {
          ...currentLock,
          threshold,
        },
      };

      setSliderValues((currentValues) =>
        clampSliderValues(currentValues, computeSliderBounds(currentValues, nextLocks))
      );

      return nextLocks;
    });
  }

  const sliderBounds = useMemo(() => {
    return computeSliderBounds(sliderValues, sliderLocks);
  }, [sliderValues, sliderLocks]);

  const commonLawMatches = useMemo(() => {
    return computeCommonLawMatches(
      sliderValues,
      localizedCommonLawEstates,
      activeCommonLawJurisdiction
    );
  }, [sliderValues, localizedCommonLawEstates, activeCommonLawJurisdiction]);

  const civilLawMatches = useMemo(() => {
    return computeCivilMatches(
      sliderValues,
      localizedCivilLawEstates,
      activeCivilJurisdiction,
      activeAssetType
    );
  }, [
    sliderValues,
    localizedCivilLawEstates,
    activeCivilJurisdiction,
    activeAssetType,
  ]);

  const baseSliderAnnotations = useMemo(() => {
    return getSliderAnnotations(
      civilLawMatches[0]?.estate,
      activeCivilJurisdiction,
      activeAssetType,
      sliderValues
    );
  }, [civilLawMatches, activeCivilJurisdiction, activeAssetType, sliderValues]);

  const convergenceResults = useMemo(() => {
    return computeConvergence(
      commonLawMatches,
      civilLawMatches,
      harmonizationData
    ).map((result) => localizeConvergenceResult(result, locale));
  }, [commonLawMatches, civilLawMatches, locale]);

  const rawViolations = useMemo(() => {
    return checkViolations(sliderValues, {
      commonLawMatches,
      civilLawMatches,
      jurisdiction: activeCivilJurisdiction,
      assetType: activeAssetType,
    });
  }, [
    sliderValues,
    commonLawMatches,
    civilLawMatches,
    activeCivilJurisdiction,
    activeAssetType,
  ]);

  const violations = useMemo(() => {
    return rawViolations.map((violation) => localizeViolation(violation, locale));
  }, [rawViolations, locale]);

  const sliderAnnotations = useMemo(() => {
    const localizedAnnotations = baseSliderAnnotations.map((annotation) =>
      localizeSliderAnnotation(annotation, locale)
    );
    const manualLockAnnotations = SLIDER_KEYS.flatMap((key) => {
      const sliderLock = sliderLocks[key];

      if (!sliderLock?.enabled) {
        return [];
      }

      const threshold = normalizeThreshold(sliderLock.threshold, sliderValues[key]);

      return [
        {
          dimension: key,
          message: ui.sliderPanel.lockedAt(threshold),
          severity: 'locked',
        },
      ];
    });

    violations.forEach((violation) => {
      if (violation.id === 'abstraktionsprinzip_note') {
        localizedAnnotations.push({
          dimension: 'alienation',
          message: violation.message,
          severity: 'info',
        });
      }
    });

    return [...manualLockAnnotations, ...localizedAnnotations];
  }, [baseSliderAnnotations, locale, sliderLocks, sliderValues, ui, violations]);

  const toastViolations = useMemo(() => {
    return violations.filter(({ severity }) => severity !== 'info');
  }, [violations]);

  const sliderPanelNote = useMemo(() => {
    return (
      violations.find(({ id }) => id === 'numerus_clausus_violation') ?? null
    );
  }, [violations]);

  const bothTracksMatch = useMemo(() => {
    return (
      (commonLawMatches[0]?.score ?? 0) >= MATCH_THRESHOLD &&
      (civilLawMatches[0]?.score ?? 0) >= MATCH_THRESHOLD
    );
  }, [commonLawMatches, civilLawMatches]);

  const filteredInstruments = useMemo(() => {
    if (!bothTracksMatch) {
      return [];
    }

    return filterInstruments(sliderValues, harmonizationInstruments).map((entry) =>
      localizeInstrument(entry, locale)
    );
  }, [bothTracksMatch, locale, sliderValues]);

  const commonLawContextHint =
    activeCommonLawJurisdiction == null
      ? null
      : ui.sliderPanel.commonLawContextHints?.[activeCommonLawJurisdiction] ??
        null;

  return (
    <div className={`app-layout ${mode === 'intl' ? 'mode-intl' : 'mode-property'}`}>
      <header className="app-hero">
        <div className="hero-shell">
          <div className="hero-copy">
            <p className="hero-kicker">{ui.heroKicker}</p>
            <h1>ccModel Explorer</h1>
            <p className="hero-text">{ui.heroText}</p>
          </div>

          <div className="hero-aside">
            <div className="hero-topbar">
              <LanguageSwitcher locale={locale} onChange={setLocale} ui={ui} />
            </div>

            <ModeSwitcher mode={mode} onChange={handleModeChange} ui={ui} />

            <div className="hero-metrics">
              <span className="metric-chip">{ui.heroMetrics.commonLaw}</span>
              <span className="metric-chip">{ui.heroMetrics.civilLaw}</span>
              <span className="metric-chip">{ui.heroMetrics.convergence}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="panel-sliders">
        <SliderPanel
          values={sliderValues}
          onChange={handleSliderChange}
          commonLawEstates={localizedCommonLawEstates}
          civilLawEstates={localizedCivilLawEstates}
          activeCommonLawJurisdiction={activeCommonLawJurisdiction}
          onCommonLawJurisdictionChange={handleCommonLawJurisdictionChange}
          activeCivilJurisdiction={activeCivilJurisdiction}
          onCivilLawJurisdictionChange={handleCivilJurisdictionChange}
          activeAssetType={activeAssetType}
          onAssetTypeChange={handleAssetTypeChange}
          sliderAnnotations={sliderAnnotations}
          sliderBounds={sliderBounds}
          panelNote={sliderPanelNote}
          sliderMeta={sliderMeta}
          sliderLocks={sliderLocks}
          onSliderLockToggle={handleSliderLockToggle}
          onSliderLockThresholdChange={handleSliderLockThresholdChange}
          ui={ui}
          locale={locale}
          mode={mode}
          commonLawContextHint={commonLawContextHint}
        />
      </section>

      <ViolationAlert violations={toastViolations} />

      <main className="app-main">
        <DualTrackView
          commonLawMatches={commonLawMatches}
          civilLawMatches={civilLawMatches}
          convergenceResults={convergenceResults}
          bothTracksMatch={bothTracksMatch}
          filteredInstruments={filteredInstruments}
          activeJurisdiction={activeCivilJurisdiction}
          locale={locale}
          ui={ui}
        />
      </main>

      <footer className="app-footer">{ui.footer}</footer>
    </div>
  );
}

export default App;
