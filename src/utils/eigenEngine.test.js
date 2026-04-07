import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import {
  computeEigenstructure,
  computeGlobalPCA,
} from './eigenEngine.js';

const DIMENSIONS = [
  'possession',
  'use',
  'income',
  'alienation',
  'exclusion',
  'duration',
  'inheritability',
];

const estates = JSON.parse(
  readFileSync(new URL('../data/commonLawEstates.json', import.meta.url), 'utf8')
);

const feeSimpleAbsolute = estates.find(
  (estate) => estate.id === 'fee_simple_absolute'
);
const lifeEstate = estates.find((estate) => estate.id === 'life_estate');
const easement = estates.find((estate) => estate.id === 'easement');

function uniformVariance([min, max]) {
  return ((max - min) ** 2) / 12;
}

function midpoint([min, max]) {
  return (min + max) / 2;
}

function dot(left, right) {
  return left.reduce((sum, value, index) => sum + value * right[index], 0);
}

function norm(vector) {
  return Math.sqrt(dot(vector, vector));
}

function multiplyMatrixVector(matrix, vector) {
  return matrix.map((row) => dot(row, vector));
}

function computeEstateCovariance(estate) {
  return DIMENSIONS.map((rowKey, rowIndex) =>
    DIMENSIONS.map((columnKey, columnIndex) =>
      rowIndex === columnIndex ? uniformVariance(estate.ranges[rowKey]) : 0
    )
  );
}

function computeSampleCovariance(sampleEstates) {
  const rows = sampleEstates.map((estate) =>
    DIMENSIONS.map((key) => midpoint(estate.ranges[key]))
  );
  const means = DIMENSIONS.map((_, columnIndex) => {
    const sum = rows.reduce((total, row) => total + row[columnIndex], 0);
    return sum / rows.length;
  });
  const centered = rows.map((row) =>
    row.map((value, columnIndex) => value - means[columnIndex])
  );
  const denominator = rows.length > 1 ? rows.length - 1 : 1;

  return DIMENSIONS.map((_, rowIndex) =>
    DIMENSIONS.map((__, columnIndex) => {
      let sum = 0;

      for (const row of centered) {
        sum += row[rowIndex] * row[columnIndex];
      }

      return sum / denominator;
    })
  );
}

function assertEigenpair(covarianceMatrix, eigenvalue, eigenvector, tolerance) {
  const projected = multiplyMatrixVector(covarianceMatrix, eigenvector);
  const scaled = eigenvector.map((value) => value * eigenvalue);

  projected.forEach((value, index) => {
    assert.ok(
      Math.abs(value - scaled[index]) < tolerance,
      `eigenpair mismatch at index ${index}: ${value} vs ${scaled[index]}`
    );
  });
}

test('computeEigenstructure decomposes a single-estate covariance matrix', () => {
  const result = computeEigenstructure(feeSimpleAbsolute);
  const covarianceMatrix = computeEstateCovariance(feeSimpleAbsolute);

  assert.equal(result.eigenvalues.length, 7);
  assert.equal(result.eigenvectors.length, 7);
  assert.equal(result.principalAxes.length, 7);

  for (let index = 1; index < result.eigenvalues.length; index += 1) {
    assert.ok(result.eigenvalues[index - 1] >= result.eigenvalues[index]);
  }

  assert.equal(result.principalAxes[0].dominantDimension, 'income');
  assert.ok(Math.abs(result.eigenvalues[0] - uniformVariance([85, 100])) < 1e-10);

  result.eigenvectors.forEach((eigenvector, index) => {
    assert.equal(eigenvector.length, 7);
    assert.ok(Math.abs(norm(eigenvector) - 1) < 1e-10);
    assertEigenpair(covarianceMatrix, result.eigenvalues[index], eigenvector, 1e-10);
  });
});

test('computeGlobalPCA returns the top three principal components for fixture estates', () => {
  // With n=3 centered samples the data matrix has rank at most n-1=2,
  // so the sample covariance has rank <= 2 and the third eigenvalue is ~0.
  const result = computeGlobalPCA([
    feeSimpleAbsolute,
    lifeEstate,
    easement,
  ]);
  const covarianceMatrix = computeSampleCovariance([
    feeSimpleAbsolute,
    lifeEstate,
    easement,
  ]);

  assert.equal(result.length, 3);

  for (let index = 1; index < result.length; index += 1) {
    assert.ok(result[index - 1].eigenvalue >= result[index].eigenvalue);
  }

  // Third component is vacuous due to rank deficiency.
  assert.ok(
    Math.abs(result[2].eigenvalue) < 1e-8,
    `third eigenvalue should be ~0 (rank deficiency), got ${result[2].eigenvalue}`
  );

  // Top two components should explain ~100% of variance.
  const topTwoExplained =
    result[0].explainedVarianceRatio + result[1].explainedVarianceRatio;
  assert.ok(
    Math.abs(topTwoExplained - 1) < 1e-8,
    `top two components should explain ~100% of variance, got ${topTwoExplained}`
  );

  const explainedVariance = result.reduce(
    (sum, component) => sum + component.explainedVarianceRatio,
    0
  );

  assert.ok(explainedVariance > 0);
  assert.ok(explainedVariance <= 1 + 1e-10);

  result.forEach((component) => {
    assert.equal(component.eigenvector.length, 7);
    assert.ok(Math.abs(norm(component.eigenvector) - 1) < 1e-10);
    assertEigenpair(
      covarianceMatrix,
      component.eigenvalue,
      component.eigenvector,
      1e-8
    );
  });

  const dot01 = dot(result[0].eigenvector, result[1].eigenvector);
  const dot02 = dot(result[0].eigenvector, result[2].eigenvector);
  const dot12 = dot(result[1].eigenvector, result[2].eigenvector);

  assert.ok(Math.abs(dot01) < 1e-8);
  assert.ok(Math.abs(dot02) < 1e-8);
  assert.ok(Math.abs(dot12) < 1e-8);
});

// --- Coupling tests ---

const feeTail = estates.find((estate) => estate.id === 'fee_tail');

// Mirrors the engine's coupling logic intentionally — used for eigenpair
// verification. The analytically exact 2D test is the ground-truth check
// for coupling math correctness.
function computeCoupledCovariance(estate) {
  const matrix = computeEstateCovariance(estate);

  if (!estate.dimensionCouplings) {
    return matrix;
  }

  for (const coupling of estate.dimensionCouplings) {
    const [dimA, dimB] = coupling.dimensions;
    const i = DIMENSIONS.indexOf(dimA);
    const j = DIMENSIONS.indexOf(dimB);
    const sigmaI = Math.sqrt(uniformVariance(estate.ranges[dimA]));
    const sigmaJ = Math.sqrt(uniformVariance(estate.ranges[dimB]));
    const offDiag = coupling.correlation * sigmaI * sigmaJ;
    matrix[i][j] = offDiag;
    matrix[j][i] = offDiag;
  }

  return matrix;
}

test('backward compatibility: estate without couplings produces same result', () => {
  const result = computeEigenstructure(feeSimpleAbsolute);

  assert.equal(result.hasCouplings, false);
  assert.equal(result.projected, false);
  assert.deepEqual(result.frozenDimensions, []);

  assert.equal(result.principalAxes[0].dominantDimension, 'income');
  assert.ok(
    Math.abs(result.eigenvalues[0] - uniformVariance([85, 100])) < 1e-10
  );
});

test('empty dimensionCouplings array behaves like no couplings', () => {
  const estateWithEmpty = {
    ...feeSimpleAbsolute,
    dimensionCouplings: [],
  };

  const withEmpty = computeEigenstructure(estateWithEmpty);
  const without = computeEigenstructure(feeSimpleAbsolute);

  assert.equal(withEmpty.hasCouplings, false);

  withEmpty.eigenvalues.forEach((value, index) => {
    assert.ok(
      Math.abs(value - without.eigenvalues[index]) < 1e-10,
      `eigenvalue mismatch at index ${index}`
    );
  });
});

test('trace preservation: sum of eigenvalues equals sum of variances with couplings', () => {
  const result = computeEigenstructure(feeTail);
  const expectedTrace = DIMENSIONS.reduce(
    (sum, key) => sum + uniformVariance(feeTail.ranges[key]),
    0
  );
  const actualTrace = result.eigenvalues.reduce((sum, v) => sum + v, 0);

  assert.ok(
    Math.abs(actualTrace - expectedTrace) < 1e-8,
    `trace mismatch: ${actualTrace} vs ${expectedTrace}`
  );
});

test('couplings increase eigenvalue spread', () => {
  const feeTailNoCouplings = {
    id: feeTail.id,
    ranges: feeTail.ranges,
  };
  const withoutCouplings = computeEigenstructure(feeTailNoCouplings);
  const withCouplings = computeEigenstructure(feeTail);

  assert.equal(withCouplings.hasCouplings, true);
  assert.ok(
    withCouplings.eigenvalues[0] > withoutCouplings.eigenvalues[0],
    `max eigenvalue with couplings (${withCouplings.eigenvalues[0]}) should exceed without (${withoutCouplings.eigenvalues[0]})`
  );
});

test('analytically exact 2D: two active dimensions with one coupling', () => {
  // Only possession and use are active; all others frozen at [50, 50].
  // v = (20)^2 / 12 = 33.333..., rho = 0.5
  // Analytical eigenvalues: v*(1+rho) = 50, v*(1-rho) = 16.667, plus 5 zeros.
  const v = (20 * 20) / 12;
  const syntheticEstate = {
    id: 'test_2d',
    ranges: {
      possession: [40, 60],
      use: [40, 60],
      income: [50, 50],
      alienation: [50, 50],
      exclusion: [50, 50],
      duration: [50, 50],
      inheritability: [50, 50],
    },
    dimensionCouplings: [
      {
        dimensions: ['possession', 'use'],
        correlation: 0.5,
        doctrine: 'test coupling',
      },
    ],
  };

  const result = computeEigenstructure(syntheticEstate);

  assert.equal(result.hasCouplings, true);
  assert.equal(result.projected, false);

  const expectedLambda1 = v * 1.5;
  const expectedLambda2 = v * 0.5;

  assert.ok(
    Math.abs(result.eigenvalues[0] - expectedLambda1) < 1e-8,
    `first eigenvalue: expected ${expectedLambda1}, got ${result.eigenvalues[0]}`
  );
  assert.ok(
    Math.abs(result.eigenvalues[1] - expectedLambda2) < 1e-8,
    `second eigenvalue: expected ${expectedLambda2}, got ${result.eigenvalues[1]}`
  );

  // Remaining 5 eigenvalues should be 0 (frozen dimensions).
  for (let i = 2; i < 7; i += 1) {
    assert.ok(
      Math.abs(result.eigenvalues[i]) < 1e-10,
      `eigenvalue ${i} should be ~0, got ${result.eigenvalues[i]}`
    );
  }

  assert.ok(result.frozenDimensions.length === 5);
});

test('PSD enforcement: contradictory couplings trigger projection', () => {
  // rho(poss,use)=0.9, rho(use,income)=0.9, rho(poss,income)=-0.9
  // creates a non-PSD correlation block.
  const psdViolator = {
    id: 'test_psd',
    ranges: {
      possession: [40, 60],
      use: [40, 60],
      income: [40, 60],
      alienation: [40, 60],
      exclusion: [40, 60],
      duration: [40, 60],
      inheritability: [40, 60],
    },
    dimensionCouplings: [
      {
        dimensions: ['possession', 'use'],
        correlation: 0.9,
        doctrine: 'test',
      },
      {
        dimensions: ['use', 'income'],
        correlation: 0.9,
        doctrine: 'test',
      },
      {
        dimensions: ['possession', 'income'],
        correlation: -0.9,
        doctrine: 'test',
      },
    ],
  };

  const result = computeEigenstructure(psdViolator);

  assert.equal(result.projected, true);
  result.eigenvalues.forEach((value, index) => {
    assert.ok(
      value >= -1e-10,
      `eigenvalue ${index} should be non-negative after projection, got ${value}`
    );
  });
});

test('eigenpair verification on coupled estate', () => {
  const result = computeEigenstructure(feeTail);
  const covarianceMatrix = computeCoupledCovariance(feeTail);

  result.eigenvectors.forEach((eigenvector, index) => {
    assert.equal(eigenvector.length, 7);
    assert.ok(Math.abs(norm(eigenvector) - 1) < 1e-10);
    assertEigenpair(
      covarianceMatrix,
      result.eigenvalues[index],
      eigenvector,
      1e-8
    );
  });
});

test('zero-variance dimension: coupling is numerically inert', () => {
  const frozenEstate = {
    id: 'test_frozen',
    ranges: {
      possession: [50, 50],
      use: [40, 60],
      income: [40, 60],
      alienation: [50, 50],
      exclusion: [50, 50],
      duration: [50, 50],
      inheritability: [50, 50],
    },
    dimensionCouplings: [
      {
        dimensions: ['possession', 'use'],
        correlation: 0.9,
        doctrine: 'test coupling referencing frozen dimension',
      },
    ],
  };

  const result = computeEigenstructure(frozenEstate);

  assert.ok(result.frozenDimensions.includes('possession'));
  assert.ok(result.frozenDimensions.includes('alienation'));
  assert.equal(result.frozenDimensions.length, 5);
  assert.equal(result.hasCouplings, true);
  assert.equal(result.projected, false);

  // Only use and income have non-zero eigenvalues.
  const nonZero = result.eigenvalues.filter((v) => v > 1e-10);
  assert.equal(nonZero.length, 2);
});

test('validation rejects invalid couplings', () => {
  const base = {
    id: 'test_invalid',
    ranges: {
      possession: [40, 60],
      use: [40, 60],
      income: [40, 60],
      alienation: [40, 60],
      exclusion: [40, 60],
      duration: [40, 60],
      inheritability: [40, 60],
    },
  };

  // Duplicate unordered pairs.
  assert.throws(
    () =>
      computeEigenstructure({
        ...base,
        dimensionCouplings: [
          { dimensions: ['possession', 'use'], correlation: 0.5, doctrine: 'a' },
          { dimensions: ['use', 'possession'], correlation: 0.3, doctrine: 'b' },
        ],
      }),
    RangeError
  );

  // Correlation out of range.
  assert.throws(
    () =>
      computeEigenstructure({
        ...base,
        dimensionCouplings: [
          { dimensions: ['possession', 'use'], correlation: 1.5, doctrine: 'a' },
        ],
      }),
    RangeError
  );

  // Invalid dimension name.
  assert.throws(
    () =>
      computeEigenstructure({
        ...base,
        dimensionCouplings: [
          { dimensions: ['possession', 'magic'], correlation: 0.5, doctrine: 'a' },
        ],
      }),
    TypeError
  );
});

test('coupling with rho=0 produces diagonal-equivalent behavior', () => {
  const withZeroRho = {
    ...feeSimpleAbsolute,
    dimensionCouplings: [
      {
        dimensions: ['possession', 'use'],
        correlation: 0,
        doctrine: 'zero coupling',
      },
    ],
  };

  const withRho = computeEigenstructure(withZeroRho);
  const without = computeEigenstructure(feeSimpleAbsolute);

  withRho.eigenvalues.forEach((value, index) => {
    assert.ok(
      Math.abs(value - without.eigenvalues[index]) < 1e-10,
      `eigenvalue mismatch at index ${index}`
    );
  });
});
