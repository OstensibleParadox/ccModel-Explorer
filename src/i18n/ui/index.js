import { SLIDER_KEYS } from '../../utils/matchEngine';
import { mergeDeep } from '../utils.js';
import { UI_COPY } from './copy.js';
import { UI_ENHANCEMENTS } from './enhancements.js';
import { SLIDER_META_COPY, AI_SLIDER_META_COPY } from './sliders.js';

export function getUiCopy(locale) {
  const baseCopy = mergeDeep(UI_COPY.en, UI_COPY[locale] ?? {});
  const enhancementCopy = mergeDeep(
    UI_ENHANCEMENTS.en,
    UI_ENHANCEMENTS[locale] ?? {}
  );

  return mergeDeep(baseCopy, enhancementCopy);
}

export function getSliderMeta(locale) {
  const copy = SLIDER_META_COPY[locale] ?? SLIDER_META_COPY.en;

  return SLIDER_KEYS.map((key) => ({
    key,
    ...copy[key],
  }));
}

export function getAISliderMeta(locale) {
  const copy = AI_SLIDER_META_COPY[locale] ?? AI_SLIDER_META_COPY.en;

  return SLIDER_KEYS.map((key) => ({
    key,
    ...copy[key],
  }));
}

export function getConvergenceLevelLabel(level, locale) {
  const ui = getUiCopy(locale);
  return ui.convergence.levels[level] ?? ui.convergence.levels.none;
}
