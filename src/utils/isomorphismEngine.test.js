import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import {
  detectIsomorphism,
  findIsomorphicPairs,
} from './isomorphismEngine.js';

const estates = JSON.parse(
  readFileSync(new URL('../data/commonLawEstates.json', import.meta.url), 'utf8')
);
const frameworks = JSON.parse(
  readFileSync(new URL('../data/aiFrameworks.json', import.meta.url), 'utf8')
);

const feeSimpleAbsolute = estates.find(
  (estate) => estate.id === 'fee_simple_absolute'
);
const easement = estates.find((estate) => estate.id === 'easement');
const licence = estates.find((estate) => estate.id === 'licence');

const closedApiModel = frameworks.find(
  (framework) => framework.id === 'closed_api_model'
);
const openSourceModel = frameworks.find(
  (framework) => framework.id === 'open_source_model'
);
const frontierModelPreRelease = frameworks.find(
  (framework) => framework.id === 'frontier_model_pre_release'
);

test('detectIsomorphism reports high similarity for fee simple absolute and closed API models', () => {
  const result = detectIsomorphism(feeSimpleAbsolute, closedApiModel);

  assert.ok(result.similarity > 0.85, `expected > 0.85, got ${result.similarity}`);
  assert.equal(result.aligned, true);
  assert.equal(result.dominantAxisMatch, false);
});

test('detectIsomorphism reports medium similarity for easements and open-source models', () => {
  const result = detectIsomorphism(easement, openSourceModel);

  assert.ok(
    result.similarity >= 0.75 && result.similarity < 0.85,
    `expected medium similarity in [0.75, 0.85), got ${result.similarity}`
  );
  assert.equal(result.aligned, false);
  assert.equal(result.dominantAxisMatch, false);
});

test('detectIsomorphism reports low similarity for licences and frontier pre-release models', () => {
  const result = detectIsomorphism(licence, frontierModelPreRelease);

  assert.ok(result.similarity < 0.75, `expected < 0.75, got ${result.similarity}`);
  assert.equal(result.aligned, false);
  assert.equal(result.dominantAxisMatch, false);
});

test('findIsomorphicPairs cross-compares and sorts by descending similarity', () => {
  const pairs = findIsomorphicPairs(
    [feeSimpleAbsolute, easement, licence],
    [closedApiModel, openSourceModel, frontierModelPreRelease]
  );

  assert.equal(pairs.length, 9);

  for (let index = 1; index < pairs.length; index += 1) {
    assert.ok(pairs[index - 1].similarity >= pairs[index].similarity);
  }

  assert.equal(pairs[0].estate.id, 'fee_simple_absolute');
  assert.equal(pairs[0].framework.id, 'closed_api_model');
  assert.equal(pairs[1].estate.id, 'easement');
  assert.equal(pairs[1].framework.id, 'open_source_model');
});
