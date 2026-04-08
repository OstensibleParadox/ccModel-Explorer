import { computeGlobalPCA } from './eigenEngine.js';
import { cosineSimilarity } from './isomorphismEngine.js';

export const DIMENSIONS = [
  'possession',
  'use',
  'income',
  'alienation',
  'exclusion',
  'duration',
  'inheritability',
];

export const OVERLAP_THRESHOLD = 15;
export const NORM_HALF_RANGE = 50;

function midpoint([min, max]) {
  return (min + max) / 2;
}

export function entityMidpointVector(entity) {
  return DIMENSIONS.map((key) => midpoint(entity.ranges[key]));
}

export function normalizeCoords(coords, scaleFactors) {
  return coords.map((value, index) => value * scaleFactors[index]);
}

export function computeScaleFactors(projectedEntities) {
  const halfRanges = [0, 1, 2].map((axis) => {
    const maxAbs = projectedEntities.reduce(
      (maximum, { coords }) => Math.max(maximum, Math.abs(coords[axis])),
      1e-6
    );

    return maxAbs * 1.5;
  });

  return halfRanges.map((halfRange) => NORM_HALF_RANGE / halfRange);
}

export function clampUserDisplayCoords(normalized) {
  const displayLimit = NORM_HALF_RANGE * 1.1;

  return normalized.map((value) =>
    Math.max(-displayLimit, Math.min(displayLimit, value))
  );
}

/**
 * Compute PCA basis and global mean from all entities.
 *
 * @param {object[]} entities - Array of estate/framework objects with .ranges
 * @returns {{ pcs: object[], mean: number[] }}
 */
export function buildProjectionBasis(entities) {
  const midpoints = entities.map(entityMidpointVector);

  const mean = DIMENSIONS.map((_, colIndex) => {
    const sum = midpoints.reduce((total, row) => total + row[colIndex], 0);
    return sum / midpoints.length;
  });

  const pcs = computeGlobalPCA(entities);

  return { pcs, mean };
}

/**
 * Project a 7D point onto the 3-PC basis.
 *
 * @param {number[]} point7D - 7-element array (ordered by DIMENSIONS)
 * @param {{ pcs: object[], mean: number[] }} basis
 * @returns {number[]} [x, y, z] in PCA space
 */
export function projectPoint(point7D, basis) {
  const centered = point7D.map((v, i) => v - basis.mean[i]);

  return basis.pcs.map((pc) =>
    centered.reduce((sum, val, i) => sum + val * pc.eigenvector[i], 0)
  );
}

/**
 * Project all entities onto the PCA basis.
 *
 * @param {object[]} entities
 * @param {{ pcs: object[], mean: number[] }} basis
 * @returns {{ entity: object, coords: number[] }[]}
 */
export function projectAllEntities(entities, basis) {
  return entities.map((entity) => ({
    entity,
    coords: projectPoint(entityMidpointVector(entity), basis),
  }));
}

/**
 * Find entities whose projection is within threshold of the user point.
 *
 * @param {number[]} userCoords - [x, y, z] in PCA space
 * @param {{ entity: object, coords: number[] }[]} projectedEntities
 * @param {number} [threshold=OVERLAP_THRESHOLD]
 * @returns {{ entity: object, coords: number[], distance: number }[]}
 */
export function findOverlaps(
  userCoords,
  projectedEntities,
  threshold = OVERLAP_THRESHOLD
) {
  const results = [];

  for (const { entity, coords } of projectedEntities) {
    const dx = userCoords[0] - coords[0];
    const dy = userCoords[1] - coords[1];
    const dz = userCoords[2] - coords[2];
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance < threshold) {
      results.push({ entity, coords, distance });
    }
  }

  results.sort((a, b) => a.distance - b.distance);
  return results;
}

/**
 * Convert slider values object to ordered 7D array.
 *
 * @param {object} sliderValues - { possession: number, use: number, ... }
 * @returns {number[]}
 */
export function sliderValuesToArray(sliderValues) {
  return DIMENSIONS.map((key) => sliderValues[key]);
}

export function computeInspectorReport(userSliderArray, entity, basis) {
  const entityMid = entityMidpointVector(entity);
  const userCentered = userSliderArray.map((value, index) => value - basis.mean[index]);
  const entityCentered = entityMid.map((value, index) => value - basis.mean[index]);
  const cosine7D = cosineSimilarity(userCentered, entityCentered);

  const userCoords = projectPoint(userSliderArray, basis);
  const entityCoords = projectPoint(entityMid, basis);
  const pcDeltas = basis.pcs.map((pc, index) => ({
    component: pc.component,
    delta: userCoords[index] - entityCoords[index],
    explainedVarianceRatio: pc.explainedVarianceRatio,
  }));

  const totalExplained = basis.pcs.reduce(
    (sum, pc) => sum + pc.explainedVarianceRatio,
    0
  );
  const residual = Math.max(0, 1 - totalExplained);

  return {
    cosine7D,
    pcDeltas,
    totalExplained,
    residual,
  };
}
