export const SLIDER_KEYS = [
  'possession',
  'use',
  'management',
  'income',
  'capital',
  'alienation',
  'exclusion',
];

export const SLIDER_META = {
  possession: {
    label: 'Possession',
    low: 'No physical control',
    high: 'Exclusive physical control',
  },
  use: {
    label: 'Use',
    low: 'No personal enjoyment',
    high: 'Unrestricted personal enjoyment',
  },
  management: {
    label: 'Management',
    low: 'No decision authority',
    high: 'Full decision authority',
  },
  income: {
    label: 'Income',
    low: 'No right to profit',
    high: 'Full right to profit',
  },
  capital: {
    label: 'Capital',
    low: 'Cannot consume or destroy',
    high: 'May consume, waste, or destroy',
  },
  alienation: {
    label: 'Alienation',
    low: 'Cannot transfer',
    high: 'Freely transferable',
  },
  exclusion: {
    label: 'Exclusion',
    low: 'Cannot exclude others',
    high: 'Full right to exclude',
  },
};

/**
 * Score how well a slider value fits an estate's range for one dimension.
 * 1.0 if within range, decaying with distance outside.
 */
function scoreDimension(value, [lo, hi]) {
  if (value >= lo && value <= hi) return 1.0;
  const distance = value < lo ? lo - value : value - hi;
  const rangeSpan = Math.max(hi - lo, 1);
  return Math.max(0, 1 - (distance / rangeSpan) * 0.8);
}

/**
 * Compute match scores for all estates against current slider values.
 * Returns sorted array of { estate, score } (descending), all entries.
 */
export function computeMatches(sliderValues, estates) {
  return estates
    .map((estate) => {
      const total = SLIDER_KEYS.reduce(
        (sum, key) => sum + scoreDimension(sliderValues[key], estate.ranges[key]),
        0
      );
      return { estate, score: total / SLIDER_KEYS.length };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Get the midpoint of each range for an estate (used for preset snapping).
 */
export function getMidpoints(estate) {
  const midpoints = {};
  for (const key of SLIDER_KEYS) {
    const [lo, hi] = estate.ranges[key];
    midpoints[key] = Math.round((lo + hi) / 2);
  }
  return midpoints;
}
