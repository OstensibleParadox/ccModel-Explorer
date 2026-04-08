export { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, LANGUAGE_OPTIONS } from './constants.js';
export { detectLocale, isSupportedLocale, getLanguageOption, getLocaleTag, formatScore } from './utils.js';
export { getUiCopy, getSliderMeta, getAISliderMeta, getConvergenceLevelLabel } from './ui/index.js';
export {
  localizeCommonLawEstate,
  localizeCivilLawEstate,
  localizeAIFramework,
  localizeConvergenceResult,
  localizeViolation,
  localizeSliderAnnotation,
} from './legal/index.js';
