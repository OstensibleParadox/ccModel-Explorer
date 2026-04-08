import { useEffect, useMemo } from 'react';
import commonLawEstates from './data/commonLawEstates.json';
import civilLawEstates from './data/civilLawEstates.json';
import aiFrameworks from './data/aiFrameworks.json';

import AppHero from './components/AppHero';
import ControlSurface from './components/ControlSurface';
import MainDisplay from './components/MainDisplay';
import ViolationAlert from './components/ViolationAlert';
import EigenVisualization from './components/EigenVisualization';

import { useLegalState } from './hooks/useLegalState';
import { useLegalEngine } from './hooks/useLegalEngine';
import { useLegalLocalization } from './hooks/useLegalLocalization';

import {
  getCommonLawMidpointsWithContext,
  resolveCommonLawRanges,
} from './utils/commonLawResolver';
import {
  getMidpointsWithContext,
} from './utils/matchEngine';
import { resolveEffectiveRanges } from './utils/jurisdictionResolver';
import {
  detectArrangementViolations,
  findClosestAlternative,
} from './utils/arrangementViolation';

import './App.css';

const DOCUMENT_TITLES = {
  en: 'ccModel Explorer',
  zh: 'ccModel Explorer | 简体中文',
  de: 'ccModel Explorer | Deutsch',
  ja: 'ccModel Explorer | 日本語',
};

function App() {
  const state = useLegalState();
  const localizedData = useLegalLocalization(state.locale, state.mode);
  const {
    ui,
    sliderMeta,
    languageOption,
    localizeViolations,
    localizeConvergence,
    localizeInstruments,
    localizeAnnotations,
  } = localizedData;

  const engine = useLegalEngine({
    mode: state.mode,
    sliderValues: state.sliderValues,
    activeCommonLawJurisdiction: state.activeCommonLawJurisdiction,
    activeCivilJurisdiction: state.activeCivilJurisdiction,
    activeAssetType: state.activeAssetType,
    localizedCommonLawEstates: localizedData.localizedCommonLawEstates,
    localizedCivilLawEstates: localizedData.localizedCivilLawEstates,
    localizedAIFrameworks: localizedData.localizedAIFrameworks,
  });

  // UI-specific derived state
  const arrangementViolations = useMemo(() => {
    return detectArrangementViolations(state.sliderValues, state.lockedArrangement);
  }, [state.sliderValues, state.lockedArrangement]);

  const closestAlternative = useMemo(() => {
    if (arrangementViolations.length === 0 || !state.lockedArrangement) return null;
    const matches = state.lockedArrangement.track === 'common' ? engine.commonLawMatches : engine.civilLawMatches;
    return findClosestAlternative(matches, state.lockedArrangement.id);
  }, [arrangementViolations, state.lockedArrangement, engine.commonLawMatches, engine.civilLawMatches]);

  const localizedViolations = useMemo(() => localizeViolations(engine.violations), [engine.violations, localizeViolations]);
  const localizedConvergenceResults = useMemo(() => localizeConvergence(engine.convergenceResults), [engine.convergenceResults, localizeConvergence]);
  const localizedInstruments = useMemo(() => localizeInstruments(engine.filteredInstruments), [engine.filteredInstruments, localizeInstruments]);

  const sliderAnnotations = useMemo(() => {
    const annotations = localizeAnnotations(engine.baseSliderAnnotations);
    localizedViolations.forEach((violation) => {
      if (violation.id === 'abstraktionsprinzip_note') {
        annotations.push({
          dimension: 'alienation',
          message: violation.message,
          severity: 'info',
        });
      }
    });
    return annotations;
  }, [engine.baseSliderAnnotations, localizeAnnotations, localizedViolations]);

  const toastViolations = useMemo(() => {
    return localizedViolations.filter(({ severity }) => severity !== 'info');
  }, [localizedViolations]);

  const sliderPanelNote = useMemo(() => {
    return localizedViolations.find(({ id }) => id === 'numerus_clausus_violation') ?? null;
  }, [localizedViolations]);

  const allEntitiesForPCA = useMemo(() => [
    ...commonLawEstates.map((e) => ({ ...e, _category: 'commonLaw' })),
    ...civilLawEstates.map((e) => ({ ...e, _category: 'civilLaw' })),
    ...aiFrameworks.map((e) => ({ ...e, _category: 'ai' })),
  ], []);

  // Sync document title and html lang
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = languageOption.htmlLang;
      document.title = DOCUMENT_TITLES[state.locale] ?? DOCUMENT_TITLES.en;
    }
  }, [languageOption, state.locale]);

  // Event Handlers
  function handleCommonLawJurisdictionChange(jurisdiction) {
    state.setActiveCommonLawJurisdiction((current) => current === jurisdiction ? null : jurisdiction);
    state.setLockedArrangement(null);
    state.setSelectedPreset(null);
  }

  function handleCivilJurisdictionChange(jurisdiction) {
    const next = state.activeCivilJurisdiction === jurisdiction ? null : jurisdiction;
    state.setActiveCivilJurisdiction(next);
    state.setLockedArrangement(null);
    state.setSelectedPreset(null);
    if (next !== 'prc') state.setActiveAssetType(null);
  }

  function handleAssetTypeChange(assetType) {
    state.setActiveAssetType((current) => current === assetType ? null : assetType);
    state.setLockedArrangement(null);
    state.setSelectedPreset(null);
  }

  function handlePresetClick(estate, track) {
    if (state.lockedArrangement?.id === estate.id && state.lockedArrangement?.track === track) {
      state.setLockedArrangement(null);
    } else if (state.lockedArrangement) {
      state.setLockedArrangement(null);
      state.setSelectedPreset({ id: estate.id, track });
      state.setSliderValues(
        track === 'common'
          ? getCommonLawMidpointsWithContext(estate, state.activeCommonLawJurisdiction)
          : getMidpointsWithContext(estate, state.activeCivilJurisdiction, state.activeAssetType)
      );
    } else if (state.selectedPreset?.id === estate.id && state.selectedPreset?.track === track) {
      const resolvedRanges =
        track === 'common'
          ? resolveCommonLawRanges(estate, state.activeCommonLawJurisdiction)
          : resolveEffectiveRanges(estate, state.activeCivilJurisdiction, state.activeAssetType);
      state.setLockedArrangement({ id: estate.id, track, estate, resolvedRanges });
    } else {
      state.setLockedArrangement(null);
      state.setSelectedPreset({ id: estate.id, track });
      state.setSliderValues(
        track === 'common'
          ? getCommonLawMidpointsWithContext(estate, state.activeCommonLawJurisdiction)
          : getMidpointsWithContext(estate, state.activeCivilJurisdiction, state.activeAssetType)
      );
    }
  }

  function handleSnapTo(alternative) {
    const midpoints =
      state.lockedArrangement?.track === 'common'
        ? getCommonLawMidpointsWithContext(alternative.estate, state.activeCommonLawJurisdiction)
        : getMidpointsWithContext(alternative.estate, state.activeCivilJurisdiction, state.activeAssetType);
    state.setSliderValues(midpoints);
    state.setLockedArrangement(null);
    state.setSelectedPreset(null);
  }

  return (
    <div className={`app-layout ${state.mode === 'ai' ? 'mode-ai' : 'mode-property'}`}>
      <AppHero
        mode={state.mode}
        locale={state.locale}
        setLocale={state.setLocale}
        setMode={state.setMode}
        showEigenspace={state.showEigenspace}
        setShowEigenspace={state.setShowEigenspace}
        ui={ui}
      />

      <ControlSurface
        state={state}
        engine={engine}
        localizedData={localizedData}
        ui={ui}
        sliderMeta={sliderMeta}
        arrangementViolations={arrangementViolations}
        closestAlternative={closestAlternative}
        handleCommonLawJurisdictionChange={handleCommonLawJurisdictionChange}
        handleCivilJurisdictionChange={handleCivilJurisdictionChange}
        handleAssetTypeChange={handleAssetTypeChange}
        handlePresetClick={handlePresetClick}
        handleSnapTo={handleSnapTo}
        sliderAnnotations={sliderAnnotations}
        sliderPanelNote={sliderPanelNote}
      />

      <ViolationAlert violations={toastViolations} />

      {state.showEigenspace && (
        <EigenVisualization
          sliderValues={state.sliderValues}
          allEntities={allEntitiesForPCA}
          mode={state.mode}
          locale={state.locale}
          ui={ui}
        />
      )}

      <MainDisplay
        mode={state.mode}
        engine={engine}
        state={state}
        locale={state.locale}
        ui={ui}
        localizedConvergenceResults={localizedConvergenceResults}
        localizedInstruments={localizedInstruments}
        localizedViolations={localizedViolations}
        localizedAIFrameworks={localizedData.localizedAIFrameworks}
      />

      <footer className="app-footer">{ui.footer}</footer>
    </div>
  );
}

export default App;
