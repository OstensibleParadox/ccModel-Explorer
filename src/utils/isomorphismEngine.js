import { computeEigenstructure } from './eigenEngine.js';

const DIMENSIONS = [
  'possession',
  'use',
  'income',
  'alienation',
  'exclusion',
  'duration',
  'inheritability',
];

function midpointVector(subject) {
  return DIMENSIONS.map((dimension) => {
    const [min, max] = subject.ranges[dimension];
    return (min + max) / 2;
  });
}

function dot(left, right) {
  return left.reduce((sum, value, index) => sum + value * right[index], 0);
}

function magnitude(vector) {
  return Math.sqrt(dot(vector, vector));
}

function cosineSimilarity(left, right) {
  const denominator = magnitude(left) * magnitude(right);

  if (denominator === 0) {
    return 0;
  }

  const similarity = dot(left, right) / denominator;

  return Math.max(-1, Math.min(1, similarity));
}

function normalize(vector) {
  const total = vector.reduce((sum, value) => sum + value, 0);

  if (total === 0) {
    return vector.map(() => 0);
  }

  return vector.map((value) => value / total);
}

function buildAxisProfile(principalAxes, valueSelector) {
  const profile = Array(DIMENSIONS.length).fill(0);

  principalAxes.forEach((axis) => {
    const dimensionIndex = DIMENSIONS.indexOf(axis.dominantDimension);
    profile[dimensionIndex] += valueSelector(axis);
  });

  return normalize(profile);
}

function buildProjectionProfile(subject, eigenstructure) {
  const midpoint = midpointVector(subject);

  return buildAxisProfile(eigenstructure.principalAxes, (axis) =>
    Math.abs(dot(midpoint, axis.eigenvector))
  );
}

function buildSpectralProfile(eigenstructure) {
  const totalVariance = eigenstructure.eigenvalues.reduce(
    (sum, eigenvalue) => sum + Math.max(eigenvalue, 0),
    0
  );

  return buildAxisProfile(eigenstructure.principalAxes, (axis) =>
    totalVariance === 0 ? 0 : Math.max(axis.eigenvalue, 0) / totalVariance
  );
}

function buildSignature(subject) {
  const eigenstructure = computeEigenstructure(subject);

  return {
    subject,
    eigenstructure,
    projectionProfile: buildProjectionProfile(subject, eigenstructure),
    spectralProfile: buildSpectralProfile(eigenstructure),
  };
}

function compareSignatures(signatureA, signatureB) {
  const projectionSimilarity = cosineSimilarity(
    signatureA.projectionProfile,
    signatureB.projectionProfile
  );
  const spectralSimilarity = cosineSimilarity(
    signatureA.spectralProfile,
    signatureB.spectralProfile
  );
  const similarity = 0.75 * projectionSimilarity + 0.25 * spectralSimilarity;
  const dominantAxisMatch =
    signatureA.eigenstructure.principalAxes[0]?.dominantDimension ===
    signatureB.eigenstructure.principalAxes[0]?.dominantDimension;

  return {
    similarity: Math.max(0, Math.min(1, similarity)),
    dominantAxisMatch,
  };
}

function assertThreshold(threshold) {
  if (typeof threshold !== 'number' || !Number.isFinite(threshold)) {
    throw new TypeError('threshold must be a finite number');
  }

  if (threshold < 0 || threshold > 1) {
    throw new RangeError('threshold must be between 0 and 1');
  }
}

function assertComparableArray(value, label) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${label} must be an array`);
  }
}

export function detectIsomorphism(frameworkA, frameworkB, threshold = 0.85) {
  assertThreshold(threshold);

  const signatureA = buildSignature(frameworkA);
  const signatureB = buildSignature(frameworkB);
  const { similarity, dominantAxisMatch } = compareSignatures(
    signatureA,
    signatureB
  );

  return {
    similarity,
    aligned: similarity >= threshold,
    dominantAxisMatch,
  };
}

export function findIsomorphicPairs(estates, frameworks) {
  assertComparableArray(estates, 'estates');
  assertComparableArray(frameworks, 'frameworks');

  const estateSignatures = estates.map((estate) => ({
    estate,
    signature: buildSignature(estate),
  }));
  const frameworkSignatures = frameworks.map((framework) => ({
    framework,
    signature: buildSignature(framework),
  }));

  return estateSignatures
    .flatMap(({ estate, signature: estateSignature }) =>
      frameworkSignatures.map(({ framework, signature: frameworkSignature }) => {
        const { similarity } = compareSignatures(
          estateSignature,
          frameworkSignature
        );

        return {
          estate,
          framework,
          similarity,
        };
      })
    )
    .sort((left, right) => right.similarity - left.similarity);
}
