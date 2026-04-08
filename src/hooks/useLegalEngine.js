import { useMemo } from 'react';
import {
  computeCivilMatches,
} from '../utils/matchEngine';
import {
  computeCommonLawMatches,
} from '../utils/commonLawResolver';
import { computeFrameworkMatches } from '../utils/aiMatchEngine';
import { checkViolations, computeSliderBounds } from '../utils/violationRules';
import { checkAIViolations, computeAISliderBounds } from '../utils/aiViolationRules';
import { computeConvergence } from '../utils/convergenceEngine';
import { getSliderAnnotations } from '../utils/jurisdictionResolver';
import { filterInstruments } from '../utils/instrumentEngine';
import harmonizationData from '../data/harmonization.json';
import harmonizationInstruments from '../data/harmonizationInstruments.json';

const MATCH_THRESHOLD = 0.5;

export function useLegalEngine({
  mode,
  sliderValues,
  activeCommonLawJurisdiction,
  activeCivilJurisdiction,
  activeAssetType,
  localizedCommonLawEstates,
  localizedCivilLawEstates,
  localizedAIFrameworks,
}) {
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

  const frameworkMatches = useMemo(() => {
    if (mode !== 'ai') return [];
    return computeFrameworkMatches(sliderValues, localizedAIFrameworks);
  }, [localizedAIFrameworks, mode, sliderValues]);

  const convergenceResults = useMemo(() => {
    return computeConvergence(
      commonLawMatches,
      civilLawMatches,
      harmonizationData
    );
  }, [commonLawMatches, civilLawMatches]);

  const rawViolations = useMemo(() => {
    if (mode === 'ai') return checkAIViolations(sliderValues);
    return checkViolations(sliderValues, {
      commonLawMatches,
      civilLawMatches,
      jurisdiction: activeCivilJurisdiction,
      assetType: activeAssetType,
    });
  }, [
    mode,
    sliderValues,
    commonLawMatches,
    civilLawMatches,
    activeCivilJurisdiction,
    activeAssetType,
  ]);

  const sliderBounds = useMemo(() => {
    return mode === 'ai'
      ? computeAISliderBounds()
      : computeSliderBounds(sliderValues);
  }, [mode, sliderValues]);

  const baseSliderAnnotations = useMemo(() => {
    return getSliderAnnotations(
      civilLawMatches[0]?.estate,
      activeCivilJurisdiction,
      activeAssetType,
      sliderValues
    );
  }, [civilLawMatches, activeCivilJurisdiction, activeAssetType, sliderValues]);

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

  return {
    commonLawMatches,
    civilLawMatches,
    frameworkMatches,
    convergenceResults,
    violations: rawViolations,
    sliderBounds,
    baseSliderAnnotations,
    bothTracksMatch,
    filteredInstruments,
  };
}
