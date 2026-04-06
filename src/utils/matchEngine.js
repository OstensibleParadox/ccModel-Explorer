import { resolveEffectiveRanges } from './jurisdictionResolver';

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

function computeAverageScore(sliderValues, ranges) {
  const totalScore = SLIDER_KEYS.reduce((sum, key) => {
    return sum + scoreDimension(sliderValues[key], ranges[key]);
  }, 0);

  return totalScore / SLIDER_KEYS.length;
}

function getMidpointsFromRanges(ranges) {
  return Object.fromEntries(
    SLIDER_KEYS.map((key) => {
      const [min, max] = ranges[key];
      return [key, Math.round((min + max) / 2)];
    })
  );
}

export function computeMatches(sliderValues, estates) {
  return estates
    .map((estate) => {
      return {
        estate,
        score: computeAverageScore(sliderValues, estate.ranges),
      };
    })
    .sort((left, right) => right.score - left.score);
}

export function computeCivilMatches(
  sliderValues,
  estates,
  jurisdiction,
  assetType
) {
  return estates
    .map((estate) => {
      const resolvedRanges = resolveEffectiveRanges(
        estate,
        jurisdiction,
        assetType
      );

      return {
        estate,
        score: computeAverageScore(sliderValues, resolvedRanges),
      };
    })
    .sort((left, right) => right.score - left.score);
}

export function getMidpoints(estate) {
  return getMidpointsFromRanges(estate.ranges);
}

export function getMidpointsWithContext(estate, jurisdiction, assetType) {
  return getMidpointsFromRanges(
    resolveEffectiveRanges(estate, jurisdiction, assetType)
  );
}
