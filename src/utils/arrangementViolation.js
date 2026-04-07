import { SLIDER_KEYS } from './matchEngine';

export function detectArrangementViolations(sliderValues, lockedArrangement) {
  if (!lockedArrangement) return [];

  const { resolvedRanges } = lockedArrangement;
  const violations = [];

  for (const dim of SLIDER_KEYS) {
    const range = resolvedRanges[dim];
    if (!range) continue;

    const [min, max] = range;
    const value = sliderValues[dim];

    if (value < min || value > max) {
      violations.push({
        dimension: dim,
        value,
        range: [min, max],
        direction: value < min ? 'below' : 'above',
        distance: value < min ? min - value : value - max,
      });
    }
  }

  return violations;
}

export function findClosestAlternative(matches, lockedId) {
  return matches.find((match) => match.estate.id !== lockedId) ?? null;
}
