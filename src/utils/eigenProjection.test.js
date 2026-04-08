import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import commonLawEstates from '../data/commonLawEstates.json' with { type: 'json' };
import civilLawEstates from '../data/civilLawEstates.json' with { type: 'json' };
import aiFrameworks from '../data/aiFrameworks.json' with { type: 'json' };
import {
  buildProjectionBasis,
  projectPoint,
  projectAllEntities,
  findOverlaps,
  sliderValuesToArray,
  OVERLAP_THRESHOLD,
} from './eigenProjection.js';

const ALL_ENTITIES = [...commonLawEstates, ...civilLawEstates, ...aiFrameworks];

describe('buildProjectionBasis', () => {
  it('returns 3 principal components and a 7-element mean', () => {
    const basis = buildProjectionBasis(ALL_ENTITIES);

    assert.equal(basis.pcs.length, 3);
    assert.equal(basis.mean.length, 7);

    for (const pc of basis.pcs) {
      assert.ok(pc.eigenvalue >= 0, 'eigenvalue must be non-negative');
      assert.equal(pc.eigenvector.length, 7);
      assert.ok(
        pc.explainedVarianceRatio >= 0 && pc.explainedVarianceRatio <= 1,
        'variance ratio must be in [0, 1]'
      );
    }
  });

  it('PCs are in descending eigenvalue order', () => {
    const basis = buildProjectionBasis(ALL_ENTITIES);

    assert.ok(basis.pcs[0].eigenvalue >= basis.pcs[1].eigenvalue);
    assert.ok(basis.pcs[1].eigenvalue >= basis.pcs[2].eigenvalue);
  });

  it('total explained variance of top 3 PCs exceeds 60%', () => {
    const basis = buildProjectionBasis(ALL_ENTITIES);
    const total = basis.pcs.reduce((s, pc) => s + pc.explainedVarianceRatio, 0);

    assert.ok(total > 0.6, `expected > 60%, got ${(total * 100).toFixed(1)}%`);
  });
});

describe('projectPoint', () => {
  const basis = buildProjectionBasis(ALL_ENTITIES);

  it('projects the global mean to the origin [0, 0, 0]', () => {
    const coords = projectPoint(basis.mean, basis);

    for (let i = 0; i < 3; i++) {
      assert.ok(
        Math.abs(coords[i]) < 1e-10,
        `axis ${i}: expected ~0, got ${coords[i]}`
      );
    }
  });

  it('returns a 3-element array for an arbitrary 7D point', () => {
    const point = [90, 80, 70, 60, 50, 40, 30];
    const coords = projectPoint(point, basis);

    assert.equal(coords.length, 3);
    for (const v of coords) {
      assert.ok(Number.isFinite(v), 'coordinates must be finite');
    }
  });

  it('all-zero and all-100 points project to opposite quadrants', () => {
    const low = projectPoint([0, 0, 0, 0, 0, 0, 0], basis);
    const high = projectPoint([100, 100, 100, 100, 100, 100, 100], basis);

    // PC1 should separate low from high (opposite signs)
    assert.ok(
      low[0] * high[0] < 0,
      'all-0 and all-100 should project to opposite sides on PC1'
    );
  });
});

describe('projectAllEntities', () => {
  const basis = buildProjectionBasis(ALL_ENTITIES);
  const projected = projectAllEntities(ALL_ENTITIES, basis);

  it('returns one projection per entity', () => {
    assert.equal(projected.length, ALL_ENTITIES.length);
  });

  it('each projection has entity and 3D coords', () => {
    for (const { entity, coords } of projected) {
      assert.ok(entity.id, 'entity must have an id');
      assert.equal(coords.length, 3);
    }
  });

  it('fee_simple_absolute and Eigentum project to nearly the same point', () => {
    const feeSimple = projected.find(
      (p) => p.entity.id === 'fee_simple_absolute'
    );
    const eigentum = projected.find((p) => p.entity.id === 'eigentum');

    assert.ok(feeSimple, 'fee_simple_absolute must exist');
    assert.ok(eigentum, 'eigentum must exist');

    const dx = feeSimple.coords[0] - eigentum.coords[0];
    const dy = feeSimple.coords[1] - eigentum.coords[1];
    const dz = feeSimple.coords[2] - eigentum.coords[2];
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    assert.ok(
      distance < 5,
      `structural equivalents should be close, got distance ${distance.toFixed(2)}`
    );
  });
});

describe('findOverlaps', () => {
  const basis = buildProjectionBasis(ALL_ENTITIES);
  const projected = projectAllEntities(ALL_ENTITIES, basis);

  it('returns empty array when user point is far from all entities', () => {
    const farPoint = [200, 200, 200]; // way outside data range
    const overlaps = findOverlaps(farPoint, projected);

    assert.equal(overlaps.length, 0);
  });

  it('detects overlap when user slides match fee_simple_absolute midpoints', () => {
    const feeSimple = ALL_ENTITIES.find(
      (e) => e.id === 'fee_simple_absolute'
    );
    const midpoints = Object.keys(feeSimple.ranges).map(
      (k) => (feeSimple.ranges[k][0] + feeSimple.ranges[k][1]) / 2
    );
    // Need to reorder by SLIDER_KEYS — but fee_simple ranges keys match SLIDER_KEYS order
    const userCoords = projectPoint(midpoints, basis);
    const overlaps = findOverlaps(userCoords, projected);

    assert.ok(overlaps.length >= 1, 'should detect at least one overlap');

    const ids = overlaps.map((o) => o.entity.id);
    assert.ok(
      ids.includes('fee_simple_absolute'),
      'fee_simple_absolute should be in overlaps'
    );
  });

  it('results are sorted by ascending distance', () => {
    const feeSimple = ALL_ENTITIES.find(
      (e) => e.id === 'fee_simple_absolute'
    );
    const midpoints = Object.keys(feeSimple.ranges).map(
      (k) => (feeSimple.ranges[k][0] + feeSimple.ranges[k][1]) / 2
    );
    const userCoords = projectPoint(midpoints, basis);
    const overlaps = findOverlaps(userCoords, projected);

    for (let i = 1; i < overlaps.length; i++) {
      assert.ok(
        overlaps[i].distance >= overlaps[i - 1].distance,
        'results must be sorted ascending by distance'
      );
    }
  });

  it('each overlap result has entity, coords, and distance fields', () => {
    const userCoords = projectPoint(basis.mean, basis); // center of data
    const overlaps = findOverlaps(userCoords, projected, 50); // large threshold

    for (const overlap of overlaps) {
      assert.ok(overlap.entity.id, 'must have entity.id');
      assert.equal(overlap.coords.length, 3, 'must have 3D coords');
      assert.ok(
        Number.isFinite(overlap.distance),
        'distance must be finite'
      );
    }
  });

  it('respects custom threshold', () => {
    const userCoords = projectPoint(basis.mean, basis);
    const tight = findOverlaps(userCoords, projected, 1);
    const loose = findOverlaps(userCoords, projected, 100);

    assert.ok(
      loose.length >= tight.length,
      'looser threshold should return at least as many results'
    );
  });
});

describe('sliderValuesToArray', () => {
  it('converts slider object to ordered array', () => {
    const values = {
      possession: 10,
      use: 20,
      income: 30,
      alienation: 40,
      exclusion: 50,
      duration: 60,
      inheritability: 70,
    };
    const arr = sliderValuesToArray(values);

    assert.deepEqual(arr, [10, 20, 30, 40, 50, 60, 70]);
  });
});

describe('OVERLAP_THRESHOLD', () => {
  it('is a positive number', () => {
    assert.ok(OVERLAP_THRESHOLD > 0);
    assert.ok(Number.isFinite(OVERLAP_THRESHOLD));
  });
});
