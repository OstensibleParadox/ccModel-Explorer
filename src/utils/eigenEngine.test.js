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

  const explainedVariance = result.reduce(
    (sum, component) => sum + component.explainedVarianceRatio,
    0
  );

  assert.ok(explainedVariance > 0);
  assert.ok(explainedVariance <= 1);

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
