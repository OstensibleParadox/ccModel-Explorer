import { useState, useCallback, useEffect } from 'react';
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  detectLocale,
  isSupportedLocale,
} from '../i18n';
import { SLIDER_KEYS } from '../utils/matchEngine';
import { computeSliderBounds } from '../utils/violationRules';
import { computeAISliderBounds } from '../utils/aiViolationRules';

const INITIAL_VALUES = Object.fromEntries(SLIDER_KEYS.map((key) => [key, 50]));

const AI_DEFAULT_VALUES = {
  possession: 55,
  use: 80,
  income: 80,
  alienation: 7,
  exclusion: 85,
  duration: 90,
  inheritability: 5,
};

function resolveInitialLocale() {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (isSupportedLocale(storedLocale)) return storedLocale;
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

export function useLegalState() {
  const [locale, setLocale] = useState(resolveInitialLocale);
  const [mode, setMode] = useState('property');
  const [sliderValues, setSliderValues] = useState(INITIAL_VALUES);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [lockedArrangement, setLockedArrangement] = useState(null);
  const [activeCommonLawJurisdiction, setActiveCommonLawJurisdiction] = useState(null);
  const [activeCivilJurisdiction, setActiveCivilJurisdiction] = useState(null);
  const [activeAssetType, setActiveAssetType] = useState(null);
  const [violationModalDimension, setViolationModalDimension] = useState(null);
  const [showEigenspace, setShowEigenspace] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    }
  }, [locale]);

  const handleSliderChange = useCallback((nextValues) => {
    setSliderValues((currentValues) => {
      const resolvedValues =
        typeof nextValues === 'function' ? nextValues(currentValues) : nextValues;
      const nextBounds =
        mode === 'ai'
          ? computeAISliderBounds()
          : computeSliderBounds(resolvedValues);

      return clampSliderValues(resolvedValues, nextBounds);
    });
  }, [mode]);

  const handleModeChange = useCallback((nextMode) => {
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
  }, []);

  const handleReset = useCallback(() => {
    handleSliderChange(INITIAL_VALUES);
    setSelectedPreset(null);
    setLockedArrangement(null);
  }, [handleSliderChange]);

  return {
    locale,
    setLocale,
    mode,
    setMode: handleModeChange,
    sliderValues,
    setSliderValues: handleSliderChange,
    selectedPreset,
    setSelectedPreset,
    lockedArrangement,
    setLockedArrangement,
    activeCommonLawJurisdiction,
    setActiveCommonLawJurisdiction,
    activeCivilJurisdiction,
    setActiveCivilJurisdiction,
    activeAssetType,
    setActiveAssetType,
    violationModalDimension,
    setViolationModalDimension,
    showEigenspace,
    setShowEigenspace,
    handleReset,
  };
}
