export const SLIDER_KEYS = [
  'possession',
  'use',
  'income',
  'alienation',
  'exclusion',
  'duration',
  'inheritability',
];

export const SLIDER_META = [
  {
    key: 'possession',
    label: 'Possession',
    lowLabel: 'No factual control',
    highLabel: 'Exclusive physical control',
  },
  {
    key: 'use',
    label: 'Use',
    lowLabel: 'No beneficial use',
    highLabel: 'Broad beneficial use',
  },
  {
    key: 'income',
    label: 'Income',
    lowLabel: 'No fruits or revenue',
    highLabel: 'Full income capture',
  },
  {
    key: 'alienation',
    label: 'Alienation',
    lowLabel: 'Non-transferable',
    highLabel: 'Freely transferable',
  },
  {
    key: 'exclusion',
    label: 'Exclusion',
    lowLabel: 'Cannot exclude others',
    highLabel: 'Strong exclusion power',
  },
  {
    key: 'duration',
    label: 'Duration',
    lowLabel: 'Ephemeral or revocable',
    highLabel: 'Perpetual or near-perpetual',
  },
  {
    key: 'inheritability',
    label: 'Inheritability',
    lowLabel: 'Dies with holder',
    highLabel: 'Fully descendible',
  },
];

export function scoreDimension(value, [min, max]) {
  if (value >= min && value <= max) {
    return 1;
  }

  const distance = value < min ? min - value : value - max;
  const rangeWidth = Math.max(max - min, 10);
  const tolerance = rangeWidth + 20;

  return Math.max(0, 1 - distance / tolerance);
}

export function computeMatches(sliderValues, estates) {
  return estates
    .map((estate) => {
      const totalScore = SLIDER_KEYS.reduce((sum, key) => {
        return sum + scoreDimension(sliderValues[key], estate.ranges[key]);
      }, 0);

      return {
        estate,
        score: totalScore / SLIDER_KEYS.length,
      };
    })
    .sort((left, right) => right.score - left.score);
}

export function getMidpoints(estate) {
  return Object.fromEntries(
    SLIDER_KEYS.map((key) => {
      const [min, max] = estate.ranges[key];
      return [key, Math.round((min + max) / 2)];
    })
  );
}
