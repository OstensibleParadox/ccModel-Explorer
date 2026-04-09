import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeUploadedFramework } from './normalizeUploadedFramework.js';

const DIMENSIONS = [
  'possession',
  'use',
  'income',
  'alienation',
  'exclusion',
  'duration',
  'inheritability',
];

const mockRanges = {
  possession: [10, 20],
  use: [20, 30],
  income: [30, 40],
  alienation: [40, 50],
  exclusion: [50, 60],
  duration: [60, 70],
  inheritability: [70, 80]
};

test('Form A (flat) passes through with correct metadata', () => {
  const uploaded = {
    id: 'flat_id',
    name: 'Flat Name',
    ranges: { ...mockRanges },
    authority: 'Flat Authority',
    jurisdiction: 'flat_jurisdiction',
    notes: 'Flat notes'
  };

  const { parent, analyzableEntries } = normalizeUploadedFramework(uploaded);

  assert.equal(parent.id, 'flat_id');
  assert.equal(parent.isComposite, false);
  assert.equal(analyzableEntries.length, 1);
  
  const entry = analyzableEntries[0];
  assert.equal(entry.id, 'flat_id');
  assert.equal(entry.name, 'Flat Name');
  assert.equal(entry._isComponentOf, null);
  assert.equal(entry._parentId, null);
  assert.deepEqual(entry.ranges, mockRanges);
  
  DIMENSIONS.forEach(dim => {
    assert.ok(Array.isArray(entry.ranges[dim]), `Missing dimension: ${dim}`);
  });
});

test('Form B (composite) splits into separate analyzable entries', () => {
  const uploaded = {
    id: 'comp_id',
    name: 'Composite Name',
    components: [
      { name: 'Alpha', ranges: { ...mockRanges } },
      { name: 'Beta', ranges: { ...mockRanges } }
    ],
    authority: 'Comp Authority'
  };

  const { parent, analyzableEntries } = normalizeUploadedFramework(uploaded);

  assert.equal(parent.isComposite, true);
  assert.equal(parent.componentCount, 2);
  assert.equal(analyzableEntries.length, 2);

  assert.equal(analyzableEntries[0].id, 'comp_id__alpha');
  assert.equal(analyzableEntries[0].name, 'Composite Name — Alpha');
  assert.equal(analyzableEntries[0]._isComponentOf, 'Composite Name');
  assert.equal(analyzableEntries[0]._parentId, 'comp_id');
  assert.equal(analyzableEntries[0].authority, 'Comp Authority');

  assert.equal(analyzableEntries[1].id, 'comp_id__beta');
  assert.equal(analyzableEntries[1].name, 'Composite Name — Beta');
});

test('Component IDs are properly slugged and handle non-ASCII', () => {
  const uploaded = {
    id: 'slug_test',
    name: 'Slug Test',
    components: [
      { name: '持有权', ranges: { ...mockRanges } },
      { name: 'User Rights 123!', ranges: { ...mockRanges } },
      { name: '   Spaces   ', ranges: { ...mockRanges } }
    ],
    authority: 'Auth'
  };

  const { analyzableEntries } = normalizeUploadedFramework(uploaded);

  // Non-ASCII '持有权' results in empty slug, should fallback to component_1
  assert.equal(analyzableEntries[0].id, 'slug_test__component_1');
  
  // 'User Rights 123!' -> 'user_rights_123'
  assert.equal(analyzableEntries[1].id, 'slug_test__user_rights_123');
  
  // '   Spaces   ' -> 'spaces'
  assert.equal(analyzableEntries[2].id, 'slug_test__spaces');
});

test('Normalizer does not mutate the input object', () => {
  const uploaded = {
    id: 'mutate_test',
    name: 'Mutate Test',
    ranges: { ...mockRanges },
    authority: 'Auth'
  };
  const original = JSON.parse(JSON.stringify(uploaded));

  normalizeUploadedFramework(uploaded);

  assert.deepEqual(uploaded, original);
});

test('Authority is copied from parent to all child entries', () => {
  const uploaded = {
    id: 'auth_test',
    name: 'Auth Test',
    components: [
      { name: 'C1', ranges: { ...mockRanges } },
      { name: 'C2', ranges: { ...mockRanges } }
    ],
    authority: 'Common Authority'
  };

  const { analyzableEntries } = normalizeUploadedFramework(uploaded);

  assert.equal(analyzableEntries[0].authority, 'Common Authority');
  assert.equal(analyzableEntries[1].authority, 'Common Authority');
});
