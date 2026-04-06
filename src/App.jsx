import { useEffect, useMemo, useState } from 'react';
import commonLawEstates from './data/commonLawEstates.json';
import civilLawEstates from './data/civilLawEstates.json';
import harmonizationData from './data/harmonization.json';
import harmonizationInstruments from './data/harmonizationInstruments.json';
import aiFrameworks from './data/aiFrameworks.json';
import LanguageSwitcher from './components/LanguageSwitcher';
import ModeSwitcher from './components/ModeSwitcher';
import SliderPanel from './components/SliderPanel';
import DualTrackView from './components/DualTrackView';
import AIFrameworkPanel from './components/AIFrameworkPanel';
import ViolationAlert from './components/ViolationAlert';
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  detectLocale,
  getLanguageOption,
  getSliderMeta,
  getAISliderMeta,
  getUiCopy,
  isSupportedLocale,
  localizeAIFramework,
  localizeCommonLawEstate,
  localizeCivilLawEstate,
  localizeConvergenceResult,
  localizeSliderAnnotation,
  localizeViolation,
} from './i18n';
import { computeConvergence } from './utils/convergenceEngine';
import {
  computeCivilMatches,
  SLIDER_KEYS,
} from './utils/matchEngine';
import { computeCommonLawMatches } from './utils/commonLawResolver';
import { computeFrameworkMatches } from './utils/aiMatchEngine';
import { getSliderAnnotations } from './utils/jurisdictionResolver';
import { checkViolations, computeSliderBounds } from './utils/violationRules';
import { checkAIViolations, computeAISliderBounds } from './utils/aiViolationRules';
import { localizeInstrument } from './utils/instrumentLocalization';
import { filterInstruments } from './utils/instrumentEngine';
import './App.css';

const MATCH_THRESHOLD = 0.5;

const INITIAL_VALUES = Object.fromEntries(SLIDER_KEYS.map((key) => [key, 50]));
const INITIAL_SLIDER_LOCKS = Object.fromEntries(
  SLIDER_KEYS.map((key) => [key, { enabled: false, threshold: null }])
);

// Default slider configuration for AI Governance mode: Closed API Model midpoints.
// Triggers value_capture_without_accountability immediately to demonstrate the demo.
const AI_DEFAULT_VALUES = {
  possession: 55,    // autonomy — moderate
  use: 80,           // capability scope — high
  income: 80,        // value capture — high
  alienation: 7,     // transferability — locked
  exclusion: 85,     // access control — gated
  duration: 90,      // deployment persistence — always-on
  inheritability: 5, // replicability — proprietary
};
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
  const [mode, setMode] = useState('property'); // 'property' | 'ai'
  const [sliderValues, setSliderValues] = useState(INITIAL_VALUES);
  const [sliderLocks, setSliderLocks] = useState(INITIAL_SLIDER_LOCKS);
  const [activeCommonLawJurisdiction, setActiveCommonLawJurisdiction] =
    useState(null);
  const [activeCivilJurisdiction, setActiveCivilJurisdiction] = useState(null);
  const [activeAssetType, setActiveAssetType] = useState(null);

  const ui = useMemo(() => getUiCopy(locale), [locale]);
  const propertySliderMeta = useMemo(() => getSliderMeta(locale), [locale]);
  const aiSliderMetaMemo = useMemo(() => getAISliderMeta(locale), [locale]);
  const sliderMeta = mode === 'ai' ? aiSliderMetaMemo : propertySliderMeta;
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

  const localizedAIFrameworks = useMemo(() => {
    return aiFrameworks.map((framework) =>
      localizeAIFramework(framework, locale)
    );
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

    if (nextJurisdiction != 'prc') {
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
    if (nextMode === 'ai') {
      setSliderValues(AI_DEFAULT_VALUES);
      setActiveCommonLawJurisdiction(null);
      setActiveCivilJurisdiction(null);
      setActiveAssetType(null);
    } else {
      setSliderValues(
        clampSliderValues(
          INITIAL_VALUES,
          computeSliderBounds(INITIAL_VALUES, sliderLocks)
        )
      );
    }
  }

  function handleSliderChange(nextValues) {
    setSliderValues((currentValues) => {
      const resolvedValues =
        typeof nextValues === 'function' ? nextValues(currentValues) : nextValues;
      const nextBounds =
        mode === 'ai'
          ? computeAISliderBounds()
          : computeSliderBounds(resolvedValues, sliderLocks);

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
        clampSliderValues(
          currentValues,
          mode === 'ai'
            ? computeAISliderBounds()
            : computeSliderBounds(currentValues, nextLocks)
        )
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
        clampSliderValues(
          currentValues,
          mode === 'ai'
            ? computeAISliderBounds()
            : computeSliderBounds(currentValues, nextLocks)
        )
      );

      return nextLocks;
    });
  }

  const sliderBounds = useMemo(() => {
    return mode === 'ai'
      ? computeAISliderBounds()
      : computeSliderBounds(sliderValues, sliderLocks);
  }, [mode, sliderLocks, sliderValues]);

  const frameworkMatches = useMemo(() => {
    if (mode !== 'ai') return [];
    return computeFrameworkMatches(sliderValues, localizedAIFrameworks);
  }, [localizedAIFrameworks, mode, sliderValues]);

  const aiViolations = useMemo(() => {
    if (mode !== 'ai') return [];
    return checkAIViolations(sliderValues).map((violation) =>
      localizeViolation(violation, locale)
    );
  }, [locale, mode, sliderValues]);

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
    const annotations = baseSliderAnnotations.map((annotation) =>
      localizeSliderAnnotation(annotation, locale)
    );
    const manualLockAnnotations =
      mode === 'property'
        ? SLIDER_KEYS.flatMap((key) => {
            const sliderLock = sliderLocks[key];

            if (!sliderLock?.enabled) {
              return [];
            }

            const threshold = normalizeThreshold(
              sliderLock.threshold,
              sliderValues[key]
            );

            return [
              {
                dimension: key,
                message: ui.sliderPanel.lockedAt(threshold),
                severity: 'locked',
              },
            ];
          })
        : [];

    violations.forEach((violation) => {
      if (violation.id === 'abstraktionsprinzip_note') {
        annotations.push({
          dimension: 'alienation',
          message: violation.message,
          severity: 'info',
        });
      }
    });

    return [...manualLockAnnotations, ...annotations];
  }, [baseSliderAnnotations, locale, mode, sliderLocks, sliderValues, ui, violations]);

  const toastViolations = useMemo(() => {
    if (mode === 'ai') {
      return aiViolations.filter(({ severity }) => severity !== 'info');
    }
    return violations.filter(({ severity }) => severity !== 'info');
  }, [mode, aiViolations, violations]);

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

  return (
    <div className={`app-layout ${mode === 'ai' ? 'mode-ai' : 'mode-property'}`}>
      <header className="app-hero">
        <div className="hero-shell">
          <div className="hero-copy">
            <p className="hero-kicker">
              {mode === 'ai' ? ui.aiMode.heroKicker : ui.heroKicker}
            </p>
            <h1>ccModel Explorer</h1>
            <p className="hero-text">
              {mode === 'ai'
                ? ui.aiMode.heroText
                : ui.heroText}
            </p>
          </div>

          <div className="hero-aside">
            <div className="hero-topbar">
              <LanguageSwitcher locale={locale} onChange={setLocale} ui={ui} />
            </div>

            <ModeSwitcher mode={mode} onChange={handleModeChange} ui={ui} />

            {mode === 'property' && (
              <div className="hero-metrics">
                <span className="metric-chip">{ui.heroMetrics.commonLaw}</span>
                <span className="metric-chip">{ui.heroMetrics.civilLaw}</span>
                <span className="metric-chip">{ui.heroMetrics.convergence}</span>
              </div>
            )}

            {mode === 'ai' && (
              <div className="hero-metrics">
                <span className="metric-chip">{ui.aiMode.metrics.frameworks}</span>
                <span className="metric-chip">{ui.aiMode.metrics.violations}</span>
                <span className="metric-chip">{ui.aiMode.metrics.demo}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="panel-sliders">
        <SliderPanel
          values={sliderValues}
          onChange={handleSliderChange}
          commonLawEstates={mode === 'property' ? localizedCommonLawEstates : []}
          civilLawEstates={mode === 'property' ? localizedCivilLawEstates : []}
          activeCommonLawJurisdiction={
            mode === 'property' ? activeCommonLawJurisdiction : null
          }
          onCommonLawJurisdictionChange={
            mode === 'property' ? handleCommonLawJurisdictionChange : () => {}
          }
          activeCivilJurisdiction={mode === 'property' ? activeCivilJurisdiction : null}
          onCivilLawJurisdictionChange={
            mode === 'property' ? handleCivilJurisdictionChange : () => {}
          }
          activeAssetType={mode === 'property' ? activeAssetType : null}
          onAssetTypeChange={mode === 'property' ? handleAssetTypeChange : () => {}}
          sliderAnnotations={mode === 'property' ? sliderAnnotations : []}
          sliderBounds={sliderBounds}
          panelNote={mode === 'property' ? sliderPanelNote : null}
          sliderMeta={sliderMeta}
          sliderLocks={mode === 'property' ? sliderLocks : {}}
          onSliderLockToggle={handleSliderLockToggle}
          onSliderLockThresholdChange={handleSliderLockThresholdChange}
          ui={ui}
          mode={mode}
          aiFrameworks={localizedAIFrameworks}
        />
      </section>

      <ViolationAlert violations={toastViolations} />

      <main className="app-main">
        {mode === 'property' ? (
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
        ) : (
          <AIFrameworkPanel
            matches={frameworkMatches}
            violations={aiViolations}
            frameworks={localizedAIFrameworks}
            locale={locale}
            ui={ui}
          />
        )}
      </main>
      <footer className="app-footer">{ui.footer}</footer>
    </div>
  );
}

export default App;
