import { scoreDimension, SLIDER_KEYS } from './matchEngine';

const COMMON_LAW_OVERRIDES = {
  uk: {
    adverse_possession: {
      duration: [20, 48],
      inheritability: [0, 15],
      alienation: [0, 12],
    },
    fee_tail: {
      duration: [35, 60],
      inheritability: [30, 50],
      alienation: [0, 4],
    },
  },
  us: {
    adverse_possession: {
      duration: [35, 70],
      inheritability: [10, 30],
      alienation: [0, 20],
    },
    fee_tail: {
      duration: [55, 80],
      inheritability: [45, 70],
      alienation: [0, 8],
    },
  },
};

function cloneRanges(ranges) {
  return Object.fromEntries(
    Object.entries(ranges).map(([key, range]) => [key, [...range]])
  );
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

export function resolveCommonLawRanges(estate, jurisdiction) {
  const resolvedRanges = cloneRanges(estate.ranges);
  const overrides = COMMON_LAW_OVERRIDES[jurisdiction]?.[estate.id];

  if (!overrides) {
    return resolvedRanges;
  }

  Object.entries(overrides).forEach(([key, range]) => {
    resolvedRanges[key] = [...range];
  });

  return resolvedRanges;
}

export function computeCommonLawMatches(sliderValues, estates, jurisdiction) {
  return estates
    .map((estate) => {
      const resolvedRanges = resolveCommonLawRanges(estate, jurisdiction);

      return {
        estate,
        score: computeAverageScore(sliderValues, resolvedRanges),
      };
    })
    .sort((left, right) => right.score - left.score);
}

export function getCommonLawMidpointsWithContext(estate, jurisdiction) {
  return getMidpointsFromRanges(resolveCommonLawRanges(estate, jurisdiction));
}
