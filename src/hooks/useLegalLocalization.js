import { useMemo } from 'react';
import commonLawEstates from '../data/commonLawEstates.json';
import civilLawEstates from '../data/civilLawEstates.json';
import aiFrameworks from '../data/aiFrameworks.json';
import {
  getLanguageOption,
  getSliderMeta,
  getAISliderMeta,
  getUiCopy,
  localizeAIFramework,
  localizeCommonLawEstate,
  localizeCivilLawEstate,
  localizeConvergenceResult,
  localizeSliderAnnotation,
  localizeViolation,
} from '../i18n';
import { localizeInstrument } from '../utils/instrumentLocalization';

export function useLegalLocalization(locale, mode) {
  const ui = useMemo(() => getUiCopy(locale), [locale]);
  const propertySliderMeta = useMemo(() => getSliderMeta(locale), [locale]);
  const aiSliderMetaMemo = useMemo(() => getAISliderMeta(locale), [locale]);
  const sliderMeta = mode === 'ai' ? aiSliderMetaMemo : propertySliderMeta;
  const languageOption = useMemo(() => getLanguageOption(locale), [locale]);

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

  const localizeViolations = (violations) => {
    return violations.map((v) => localizeViolation(v, locale));
  };

  const localizeConvergence = (results) => {
    return results.map((r) => localizeConvergenceResult(r, locale));
  };

  const localizeInstruments = (instruments) => {
    return instruments.map((i) => localizeInstrument(i, locale));
  };

  const localizeAnnotations = (annotations) => {
    return annotations.map((a) => localizeSliderAnnotation(a, locale));
  };

  return {
    ui,
    sliderMeta,
    languageOption,
    localizedCommonLawEstates,
    localizedCivilLawEstates,
    localizedAIFrameworks,
    localizeViolations,
    localizeConvergence,
    localizeInstruments,
    localizeAnnotations,
  };
}
