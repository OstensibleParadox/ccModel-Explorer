import { useEffect, useMemo, useState } from 'react';
import commonLawEstates from './data/commonLawEstates.json';
import civilLawEstates from './data/civilLawEstates.json';
import harmonizationData from './data/harmonization.json';
import harmonizationInstruments from './data/harmonizationInstruments.json';
import LanguageSwitcher from './components/LanguageSwitcher';
import SliderPanel from './components/SliderPanel';
import DualTrackView from './components/DualTrackView';
import ViolationAlert from './components/ViolationAlert';
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  detectLocale,
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
import {
  computeCivilMatches,
  computeMatches,
  SLIDER_KEYS,
} from './utils/matchEngine';
import { getSliderAnnotations } from './utils/jurisdictionResolver';
import { checkViolations, computeSliderBounds } from './utils/violationRules';
import { filterInstruments } from './utils/instrumentEngine';
import './App.css';

const MATCH_THRESHOLD = 0.5;

const INITIAL_VALUES = Object.fromEntries(SLIDER_KEYS.map((key) => [key, 50]));
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

function App() {
  const [locale, setLocale] = useState(resolveInitialLocale);
  const [sliderValues, setSliderValues] = useState(INITIAL_VALUES);
  const [activeJurisdiction, setActiveJurisdiction] = useState(null);
  const [activeAssetType, setActiveAssetType] = useState(null);

  const ui = useMemo(() => getUiCopy(locale), [locale]);
  const sliderMeta = useMemo(() => getSliderMeta(locale), [locale]);
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

  function handleJurisdictionChange(jurisdiction) {
    const nextJurisdiction =
      activeJurisdiction === jurisdiction ? null : jurisdiction;

    setActiveJurisdiction(nextJurisdiction);

    if (nextJurisdiction !== 'prc') {
      setActiveAssetType(null);
    }
  }

  function handleAssetTypeChange(assetType) {
    setActiveAssetType((currentAssetType) =>
      currentAssetType === assetType ? null : assetType
    );
  }

  function handleSliderChange(nextValues) {
    setSliderValues((currentValues) => {
      const resolvedValues =
        typeof nextValues === 'function' ? nextValues(currentValues) : nextValues;
      const nextBounds = computeSliderBounds(resolvedValues);

      return clampSliderValues(resolvedValues, nextBounds);
    });
  }

  const sliderBounds = useMemo(() => {
    return computeSliderBounds(sliderValues);
  }, [sliderValues]);

  const commonLawMatches = useMemo(() => {
    return computeMatches(sliderValues, localizedCommonLawEstates);
  }, [sliderValues, localizedCommonLawEstates]);

  const civilLawMatches = useMemo(() => {
    return computeCivilMatches(
      sliderValues,
      localizedCivilLawEstates,
      activeJurisdiction,
      activeAssetType
    );
  }, [
    sliderValues,
    localizedCivilLawEstates,
    activeJurisdiction,
    activeAssetType,
  ]);

  const baseSliderAnnotations = useMemo(() => {
    return getSliderAnnotations(
      civilLawMatches[0]?.estate,
      activeJurisdiction,
      activeAssetType,
      sliderValues
    );
  }, [civilLawMatches, activeJurisdiction, activeAssetType, sliderValues]);

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
      jurisdiction: activeJurisdiction,
      assetType: activeAssetType,
    });
  }, [
    sliderValues,
    commonLawMatches,
    civilLawMatches,
    activeJurisdiction,
    activeAssetType,
  ]);

  const violations = useMemo(() => {
    return rawViolations.map((violation) => localizeViolation(violation, locale));
  }, [rawViolations, locale]);

  const sliderAnnotations = useMemo(() => {
    const annotations = baseSliderAnnotations.map((annotation) =>
      localizeSliderAnnotation(annotation, locale)
    );

    violations.forEach((violation) => {
      if (violation.id === 'abstraktionsprinzip_note') {
        annotations.push({
          dimension: 'alienation',
          message: violation.message,
          severity: 'info',
        });
      }
    });

    return annotations;
  }, [baseSliderAnnotations, locale, violations]);

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
    if (!bothTracksMatch) return [];
    return filterInstruments(sliderValues, harmonizationInstruments);
  }, [bothTracksMatch, sliderValues]);

  return (
    <div className="app-layout">
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
          activeJurisdiction={activeJurisdiction}
          onJurisdictionChange={handleJurisdictionChange}
          activeAssetType={activeAssetType}
          onAssetTypeChange={handleAssetTypeChange}
          sliderAnnotations={sliderAnnotations}
          sliderBounds={sliderBounds}
          panelNote={sliderPanelNote}
          sliderMeta={sliderMeta}
          ui={ui}
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
          activeJurisdiction={activeJurisdiction}
          locale={locale}
          ui={ui}
        />
      </main>

      <footer className="app-footer">{ui.footer}</footer>
    </div>
  );
}

export default App;
