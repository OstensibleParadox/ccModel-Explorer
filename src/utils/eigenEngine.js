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

function validateCouplings(couplings) {
  if (!Array.isArray(couplings) || couplings.length === 0) {
    return [];
  }

  const seenPairs = new Set();

  for (const coupling of couplings) {
    const { dimensions, correlation, doctrine } = coupling;

    if (!Array.isArray(dimensions) || dimensions.length !== 2) {
      throw new TypeError(
        'each coupling must have a dimensions array of length 2'
      );
    }

    const [dimA, dimB] = dimensions;

    if (!DIMENSIONS.includes(dimA)) {
      throw new TypeError(`unknown dimension: ${dimA}`);
    }

    if (!DIMENSIONS.includes(dimB)) {
      throw new TypeError(`unknown dimension: ${dimB}`);
    }

    if (dimA === dimB) {
      throw new RangeError(`coupling dimensions must be distinct: ${dimA}`);
    }

    if (typeof correlation !== 'number' || !Number.isFinite(correlation)) {
      throw new TypeError('correlation must be a finite number');
    }

    if (correlation < -1 || correlation > 1) {
      throw new RangeError(
        `correlation must be in [-1, 1], got ${correlation}`
      );
    }

    if (typeof doctrine !== 'string' || doctrine.length === 0) {
      throw new TypeError('doctrine must be a non-empty string');
    }

    const pairKey = [dimA, dimB].sort().join(':');

    if (seenPairs.has(pairKey)) {
      throw new RangeError(`duplicate coupling pair: ${dimA}, ${dimB}`);
    }

    seenPairs.add(pairKey);
  }

  return couplings;
}

function buildCovarianceMatrix(estate) {
  const variances = DIMENSIONS.map((key) => uniformVariance(estate.ranges[key]));
  const covarianceMatrix = Matrix.diag(variances);

  const couplings = validateCouplings(estate.dimensionCouplings);

  if (couplings.length === 0) {
    return { covarianceMatrix, hasCouplings: false };
  }

  const sigmas = variances.map(Math.sqrt);

  for (const coupling of couplings) {
    const [dimA, dimB] = coupling.dimensions;
    const i = DIMENSIONS.indexOf(dimA);
    const j = DIMENSIONS.indexOf(dimB);
    const offDiag = cleanNumber(coupling.correlation * sigmas[i] * sigmas[j]);
    covarianceMatrix.set(i, j, offDiag);
    covarianceMatrix.set(j, i, offDiag);
  }

  return { covarianceMatrix, hasCouplings: true };
}

function ensurePSD(covarianceMatrix) {
  const size = covarianceMatrix.rows;
  const sigmas = [];

  for (let i = 0; i < size; i += 1) {
    sigmas.push(Math.sqrt(Math.max(covarianceMatrix.get(i, i), 0)));
  }

  const activeIndices = [];
  const frozenDimensions = [];

  for (let i = 0; i < size; i += 1) {
    if (sigmas[i] > 1e-12) {
      activeIndices.push(i);
    } else {
      frozenDimensions.push(DIMENSIONS[i]);
    }
  }

  const decomposition = new EigenvalueDecomposition(covarianceMatrix, {
    assumeSymmetric: true,
  });

  const minEigenvalue = Math.min(...decomposition.realEigenvalues);

  if (minEigenvalue >= -1e-10) {
    return {
      matrix: covarianceMatrix,
      eigenpairs: sortEigenpairs(decomposition),
      projected: false,
      frozenDimensions,
    };
  }

  // PSD projection needed — work in correlation space on active submatrix.
  // Note: spectral clipping does not preserve trace. The returned matrix may
  // have a different sum-of-variances than the input. The projected flag
  // signals this to consumers.
  const n = activeIndices.length;
  const activeSigmas = activeIndices.map((i) => sigmas[i]);

  // Extract active submatrix and convert to correlation.
  const corrData = [];

  for (let r = 0; r < n; r += 1) {
    const row = [];

    for (let c = 0; c < n; c += 1) {
      row.push(
        covarianceMatrix.get(activeIndices[r], activeIndices[c]) /
          (activeSigmas[r] * activeSigmas[c])
      );
    }

    corrData.push(row);
  }

  const corrMatrix = new Matrix(corrData);

  // Eigendecompose correlation, clip negatives, reconstruct.
  const corrDecomp = new EigenvalueDecomposition(corrMatrix, {
    assumeSymmetric: true,
  });
  const clippedLambdas = corrDecomp.realEigenvalues.map((l) =>
    Math.max(l, 0)
  );
  const Q = corrDecomp.eigenvectorMatrix;
  const corrPlus = Q.mmul(Matrix.diag(clippedLambdas)).mmul(Q.transpose());

  // Re-normalize to force diagonal to 1.0.
  // Save diagonal before in-place modification.
  const diagSqrt = [];

  for (let i = 0; i < n; i += 1) {
    diagSqrt.push(Math.sqrt(Math.max(corrPlus.get(i, i), 0)));
  }

  for (let r = 0; r < n; r += 1) {
    for (let c = 0; c < n; c += 1) {
      const denom = diagSqrt[r] * diagSqrt[c];

      if (denom > 1e-15) {
        corrPlus.set(r, c, corrPlus.get(r, c) / denom);
      }
    }
  }

  // Convert back to covariance with original sigmas and re-embed into full matrix.
  const repairedFull = Matrix.zeros(size, size);

  for (let r = 0; r < n; r += 1) {
    for (let c = 0; c < n; c += 1) {
      const covVal = corrPlus.get(r, c) * activeSigmas[r] * activeSigmas[c];
      repairedFull.set(activeIndices[r], activeIndices[c], cleanNumber(covVal));
    }
  }

  const repairedDecomp = new EigenvalueDecomposition(repairedFull, {
    assumeSymmetric: true,
  });

  return {
    matrix: repairedFull,
    eigenpairs: sortEigenpairs(repairedDecomp),
    projected: true,
    frozenDimensions,
  };
}

export function computeEigenstructure(estate) {
  assertEstate(estate);

  const { covarianceMatrix, hasCouplings } = buildCovarianceMatrix(estate);
  const { eigenpairs, projected, frozenDimensions } =
    ensurePSD(covarianceMatrix);

  return {
    eigenvalues: eigenpairs.map((pair) => pair.eigenvalue),
    eigenvectors: eigenpairs.map((pair) => pair.eigenvector),
    principalAxes: eigenpairs.map((pair, index) => ({
      component: index + 1,
      eigenvalue: pair.eigenvalue,
      eigenvector: pair.eigenvector,
      dominantDimension: dominantDimension(pair.eigenvector),
    })),
    projected,
    hasCouplings,
    frozenDimensions,
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
