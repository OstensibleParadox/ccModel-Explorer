import { scoreDimension, SLIDER_KEYS } from './matchEngine';

function computeAverageScore(sliderValues, ranges) {
  const totalScore = SLIDER_KEYS.reduce((sum, key) => {
    return sum + scoreDimension(sliderValues[key], ranges[key]);
  }, 0);
  return totalScore / SLIDER_KEYS.length;
}

export function getMidpoints(framework) {
  return Object.fromEntries(
    SLIDER_KEYS.map((key) => {
      const [min, max] = framework.ranges[key];
      return [key, Math.round((min + max) / 2)];
    })
  );
}

// Returns all frameworks sorted by match score, excluding special entries.
export function computeFrameworkMatches(sliderValues, frameworks) {
  return frameworks
    .filter((f) => !f.special)
    .map((framework) => ({
      framework,
      score: computeAverageScore(sliderValues, framework.ranges),
    }))
    .sort((a, b) => b.score - a.score);
}
