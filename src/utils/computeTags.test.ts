import { describe, expect, it } from 'vitest';

import { computeTags } from './computeTags';

describe('computeTags', () => {
  it('returns offense + air for Pass', () => {
    expect(computeTags('Pass', 5)).toEqual(['offense', 'air']);
  });

  it('returns offense + rush for Run', () => {
    expect(computeTags('Run', 5)).toEqual(['offense', 'rush']);
  });

  it('returns defense for Defense', () => {
    expect(computeTags('Defense', 5)).toEqual(['defense']);
  });

  it('appends quick when duration is under 3 seconds', () => {
    expect(computeTags('Pass', 2)).toEqual(['offense', 'air', 'quick']);
  });

  it('appends quick exactly at boundary — 3 is not quick', () => {
    expect(computeTags('Run', 3)).toEqual(['offense', 'rush']);
  });

  it('returns only quick for unknown play type with short duration', () => {
    expect(computeTags('Unknown', 1)).toEqual(['quick']);
  });

  it('returns empty array for empty play type and normal duration', () => {
    expect(computeTags('', 5)).toEqual([]);
  });
});
