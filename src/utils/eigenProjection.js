import { computeGlobalPCA } from './eigenEngine.js';

const DIMENSIONS = [
  'possession',
  'use',
  'income',
  'alienation',
  'exclusion',
  'duration',
  'inheritability',
];

export const OVERLAP_THRESHOLD = 15;

function midpoint([min, max]) {
  return (min + max) / 2;
}

function entityMidpointVector(entity) {
  return DIMENSIONS.map((key) => midpoint(entity.ranges[key]));
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
