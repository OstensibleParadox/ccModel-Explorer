import { EigenvalueDecomposition, Matrix } from 'ml-matrix';

const DIMENSIONS = [
  'possession',
  'use',
  'income',
  'alienation',
  'exclusion',
  'duration',
  'inheritability',
];

function cleanNumber(value) {
  return Object.is(value, -0) ? 0 : value;
}

function assertEstate(estate) {
  if (!estate || typeof estate !== 'object') {
    throw new TypeError('estate must be an object');
  }

  if (!estate.ranges || typeof estate.ranges !== 'object') {
    throw new TypeError('estate.ranges must be an object');
  }

  for (const key of DIMENSIONS) {
    const range = estate.ranges[key];

    if (!Array.isArray(range) || range.length !== 2) {
      throw new TypeError(`estate.ranges.${key} must be a [min, max] tuple`);
    }

    const [min, max] = range;

    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      throw new TypeError(`estate.ranges.${key} must contain finite numbers`);
    }

    if (max < min) {
      throw new RangeError(`estate.ranges.${key} must satisfy min <= max`);
    }
  }
}

function rangeMidpoint([min, max]) {
  return (min + max) / 2;
}

function uniformVariance([min, max]) {
  return ((max - min) ** 2) / 12;
}

function vectorFromMatrixColumn(matrix, columnIndex) {
  const vector = [];

  for (let rowIndex = 0; rowIndex < matrix.rows; rowIndex += 1) {
    vector.push(cleanNumber(matrix.get(rowIndex, columnIndex)));
  }

  return vector;
}

function orientVector(vector) {
  let pivotIndex = 0;
  let pivotMagnitude = 0;

  for (let index = 0; index < vector.length; index += 1) {
    const magnitude = Math.abs(vector[index]);

    if (magnitude > pivotMagnitude) {
      pivotMagnitude = magnitude;
      pivotIndex = index;
    }
  }

  const sign = vector[pivotIndex] < 0 ? -1 : 1;

  return vector.map((value) => cleanNumber(value * sign));
}

function sortEigenpairs(decomposition) {
  const pairs = decomposition.realEigenvalues.map((eigenvalue, index) => {
    const eigenvector = orientVector(
      vectorFromMatrixColumn(decomposition.eigenvectorMatrix, index)
    );

    return {
      eigenvalue: cleanNumber(eigenvalue),
      eigenvector,
    };
  });

  pairs.sort((left, right) => right.eigenvalue - left.eigenvalue);

  return pairs;
}

function dominantDimension(eigenvector) {
  let dominantIndex = 0;
  let dominantMagnitude = 0;

  for (let index = 0; index < eigenvector.length; index += 1) {
    const magnitude = Math.abs(eigenvector[index]);

    if (magnitude > dominantMagnitude) {
      dominantMagnitude = magnitude;
      dominantIndex = index;
    }
  }

  return DIMENSIONS[dominantIndex];
}

function buildCenteredSampleMatrix(estates) {
  if (!Array.isArray(estates) || estates.length === 0) {
    throw new TypeError('estates must be a non-empty array');
  }

  estates.forEach(assertEstate);

  const rows = estates.map((estate) =>
    DIMENSIONS.map((key) => rangeMidpoint(estate.ranges[key]))
  );
  const means = DIMENSIONS.map((_, columnIndex) => {
    const sum = rows.reduce((total, row) => total + row[columnIndex], 0);
    return sum / rows.length;
  });
  const centeredRows = rows.map((row) =>
    row.map((value, columnIndex) => cleanNumber(value - means[columnIndex]))
  );

  return new Matrix(centeredRows);
}

function computeCovarianceMatrixFromSamples(centeredSamples) {
  const denominator = centeredSamples.rows > 1 ? centeredSamples.rows - 1 : 1;
  return centeredSamples.transpose().mmul(centeredSamples).div(denominator);
}

export function computeEigenstructure(estate) {
  assertEstate(estate);

  const variances = DIMENSIONS.map((key) => uniformVariance(estate.ranges[key]));

  // With only per-dimension ranges and no coupling data, the estate covariance
  // is the diagonal covariance of seven independent uniform marginals.
  const covarianceMatrix = Matrix.diag(variances);
  const decomposition = new EigenvalueDecomposition(covarianceMatrix, {
    assumeSymmetric: true,
  });
  const eigenpairs = sortEigenpairs(decomposition);

  return {
    eigenvalues: eigenpairs.map((pair) => pair.eigenvalue),
    eigenvectors: eigenpairs.map((pair) => pair.eigenvector),
    principalAxes: eigenpairs.map((pair, index) => ({
      component: index + 1,
      eigenvalue: pair.eigenvalue,
      eigenvector: pair.eigenvector,
      dominantDimension: dominantDimension(pair.eigenvector),
    })),
  };
}

export function computeGlobalPCA(estates) {
  const centeredSamples = buildCenteredSampleMatrix(estates);
  const covarianceMatrix = computeCovarianceMatrixFromSamples(centeredSamples);
  const decomposition = new EigenvalueDecomposition(covarianceMatrix, {
    assumeSymmetric: true,
  });
  const eigenpairs = sortEigenpairs(decomposition);
  const totalVariance = eigenpairs.reduce(
    (sum, pair) => sum + Math.max(pair.eigenvalue, 0),
    0
  );

  return eigenpairs.slice(0, 3).map((pair, index) => ({
    component: index + 1,
    eigenvalue: pair.eigenvalue,
    eigenvector: pair.eigenvector,
    explainedVarianceRatio:
      totalVariance === 0 ? 0 : pair.eigenvalue / totalVariance,
  }));
}
