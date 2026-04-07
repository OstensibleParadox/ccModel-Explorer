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
import ArrangementViolationModal from './components/ArrangementViolationModal';
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
  getMidpointsWithContext,
  SLIDER_KEYS,
} from './utils/matchEngine';
import {
  computeCommonLawMatches,
  getCommonLawMidpointsWithContext,
  resolveCommonLawRanges,
} from './utils/commonLawResolver';
import { computeFrameworkMatches } from './utils/aiMatchEngine';
import { getSliderAnnotations, resolveEffectiveRanges } from './utils/jurisdictionResolver';
import { checkViolations, computeSliderBounds } from './utils/violationRules';
import { checkAIViolations, computeAISliderBounds } from './utils/aiViolationRules';
import { localizeInstrument } from './utils/instrumentLocalization';
import { filterInstruments } from './utils/instrumentEngine';
import {
  detectArrangementViolations,
  findClosestAlternative,
} from './utils/arrangementViolation';
import './App.css';

const MATCH_THRESHOLD = 0.5;

const INITIAL_VALUES = Object.fromEntries(SLIDER_KEYS.map((key) => [key, 50]));

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

function App() {
  const [locale, setLocale] = useState(resolveInitialLocale);
  const [mode, setMode] = useState('property'); // 'property' | 'ai'
  const [sliderValues, setSliderValues] = useState(INITIAL_VALUES);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [lockedArrangement, setLockedArrangement] = useState(null);
  const [activeCommonLawJurisdiction, setActiveCommonLawJurisdiction] =
    useState(null);
  const [activeCivilJurisdiction, setActiveCivilJurisdiction] = useState(null);
  const [activeAssetType, setActiveAssetType] = useState(null);
  const [violationModalDimension, setViolationModalDimension] = useState(null);

  const arrangementViolations = useMemo(() => {
    return detectArrangementViolations(sliderValues, lockedArrangement);
  }, [sliderValues, lockedArrangement]);

  const violationModalData = useMemo(() => {
    if (!violationModalDimension || !lockedArrangement) return null;
    return arrangementViolations.find(
      (v) => v.dimension === violationModalDimension
    ) ?? null;
  }, [violationModalDimension, lockedArrangement, arrangementViolations]);

  function handleSnapTo(alternative) {
    const midpoints =
      lockedArrangement?.track === 'common'
        ? getCommonLawMidpointsWithContext(alternative.estate, activeCommonLawJurisdiction)
        : getMidpointsWithContext(alternative.estate, activeCivilJurisdiction, activeAssetType);
    handleSliderChange(midpoints);
    setLockedArrangement(null);
    setSelectedPreset(null);
  }

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
    setLockedArrangement(null);
    setSelectedPreset(null);
  }

  function handleCivilJurisdictionChange(jurisdiction) {
    const nextJurisdiction =
      activeCivilJurisdiction === jurisdiction ? null : jurisdiction;

    setActiveCivilJurisdiction(nextJurisdiction);
    setLockedArrangement(null);
    setSelectedPreset(null);

    if (nextJurisdiction != 'prc') {
      setActiveAssetType(null);
    }
  }

  function handleAssetTypeChange(assetType) {
    setActiveAssetType((currentAssetType) =>
      currentAssetType === assetType ? null : assetType
    );
    setLockedArrangement(null);
    setSelectedPreset(null);
  }

  function handleModeChange(nextMode) {
    setMode(nextMode);
    setLockedArrangement(null);
    setSelectedPreset(null);
    if (nextMode === 'ai') {
      setSliderValues(AI_DEFAULT_VALUES);
      setActiveCommonLawJurisdiction(null);
      setActiveCivilJurisdiction(null);
      setActiveAssetType(null);
    } else {
      setSliderValues(
        clampSliderValues(
          INITIAL_VALUES,
          computeSliderBounds(INITIAL_VALUES)
        )
      );
    }
  }

  function handleReset() {
    handleSliderChange(INITIAL_VALUES);
    setSelectedPreset(null);
    setLockedArrangement(null);
  }

  function handleSliderChange(nextValues) {
    setSliderValues((currentValues) => {
      const resolvedValues =
        typeof nextValues === 'function' ? nextValues(currentValues) : nextValues;
      const nextBounds =
        mode === 'ai'
          ? computeAISliderBounds()
          : computeSliderBounds(resolvedValues);

      return clampSliderValues(resolvedValues, nextBounds);
    });
  }

  function handlePresetClick(estate, track) {
    if (lockedArrangement?.id === estate.id && lockedArrangement?.track === track) {
      // Same pill clicked while locked → unlock (revert to selected)
      setLockedArrangement(null);
    } else if (lockedArrangement) {
      // Different pill clicked while something else is locked → clear lock, select new
      setLockedArrangement(null);
      setSelectedPreset({ id: estate.id, track });
      handleSliderChange(
        track === 'common'
          ? getCommonLawMidpointsWithContext(estate, activeCommonLawJurisdiction)
          : getMidpointsWithContext(estate, activeCivilJurisdiction, activeAssetType)
      );
    } else if (selectedPreset?.id === estate.id && selectedPreset?.track === track) {
      // Same pill clicked while selected (not locked) → lock it
      const resolvedRanges =
        track === 'common'
          ? resolveCommonLawRanges(estate, activeCommonLawJurisdiction)
          : resolveEffectiveRanges(estate, activeCivilJurisdiction, activeAssetType);
      setLockedArrangement({ id: estate.id, track, estate, resolvedRanges });
    } else {
      // Different pill or first click → select (no lock)
      setLockedArrangement(null);
      setSelectedPreset({ id: estate.id, track });
      handleSliderChange(
        track === 'common'
          ? getCommonLawMidpointsWithContext(estate, activeCommonLawJurisdiction)
          : getMidpointsWithContext(estate, activeCivilJurisdiction, activeAssetType)
      );
    }
  }

  const sliderBounds = useMemo(() => {
    return mode === 'ai'
      ? computeAISliderBounds()
      : computeSliderBounds(sliderValues);
  }, [mode, sliderValues]);

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

  const closestAlternative = useMemo(() => {
    if (arrangementViolations.length === 0 || !lockedArrangement) return null;

    const matches =
      lockedArrangement.track === 'common' ? commonLawMatches : civilLawMatches;

    return findClosestAlternative(matches, lockedArrangement.id);
  }, [
    arrangementViolations,
    lockedArrangement,
    commonLawMatches,
    civilLawMatches,
  ]);

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
          arrangementRanges={
            mode === 'property' ? lockedArrangement?.resolvedRanges ?? null : null
          }
          panelNote={mode === 'property' ? sliderPanelNote : null}
          sliderMeta={sliderMeta}
          selectedPreset={mode === 'property' ? selectedPreset : null}
          lockedArrangement={mode === 'property' ? lockedArrangement : null}
          onPresetClick={handlePresetClick}
          onReset={handleReset}
          arrangementViolations={mode === 'property' ? arrangementViolations : []}
          closestAlternative={closestAlternative}
          onOpenViolationModal={setViolationModalDimension}
          ui={ui}
          mode={mode}
          aiFrameworks={localizedAIFrameworks}
        />
      </section>

      <ViolationAlert violations={toastViolations} />

      <ArrangementViolationModal
        open={violationModalData != null}
        onClose={() => setViolationModalDimension(null)}
        dimension={violationModalDimension}
        violation={violationModalData}
        lockedArrangement={lockedArrangement}
        closestAlternative={closestAlternative}
        onSnapTo={handleSnapTo}
        locale={locale}
        ui={ui}
        sliderMeta={sliderMeta}
      />

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
