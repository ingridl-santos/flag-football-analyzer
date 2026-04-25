import { describe, expect, it } from 'vitest';

import { type Segment } from '../redux/SegmentSlice';
import { segmentsToCsv, segmentsToJson } from './exportSegments';

const SEGMENTS: Segment[] = [
  { id: 'abc', start: 10, end: 25, duration: 15, playType: 'Pass', tags: ['offense', 'air'] },
  { id: 'def', start: 42, end: 83, duration: 41, playType: 'Run', tags: ['offense', 'rush'] },
  { id: 'ghi', start: 120, end: 122, duration: 2, playType: 'Defense', tags: ['defense', 'quick'] },
];

describe('segmentsToCsv', () => {
  it('includes the header row', () => {
    const csv = segmentsToCsv(SEGMENTS);

    expect(csv.split('\n')[0]).toBe('id,start,end,duration,playType,tags');
  });

  it('maps one row per segment', () => {
    const rows = segmentsToCsv(SEGMENTS).split('\n');

    expect(rows).toHaveLength(4); // header + 3 rows
  });

  it('joins tags with pipe separator', () => {
    const csv = segmentsToCsv(SEGMENTS);

    expect(csv).toContain('offense|air');
    expect(csv).toContain('offense|rush');
    expect(csv).toContain('defense|quick');
  });

  it('handles a segment with no playType or tags', () => {
    const csv = segmentsToCsv([{ id: 'x', start: 0, end: 5, duration: 5 }]);
    const row = csv.split('\n')[1];

    expect(row).toBe('x,0,5,5,,');
  });

  it('returns only a header row for an empty array', () => {
    expect(segmentsToCsv([])).toBe('id,start,end,duration,playType,tags');
  });
});

describe('segmentsToJson', () => {
  it('wraps segments in a segments key', () => {
    const result = JSON.parse(segmentsToJson(SEGMENTS));

    expect(result).toHaveProperty('segments');
    expect(result.segments).toHaveLength(3);
  });

  it('preserves all segment fields', () => {
    const result = JSON.parse(segmentsToJson(SEGMENTS));
    const first = result.segments[0];

    expect(first.id).toBe('abc');
    expect(first.start).toBe(10);
    expect(first.end).toBe(25);
    expect(first.duration).toBe(15);
    expect(first.playType).toBe('Pass');
    expect(first.tags).toEqual(['offense', 'air']);
  });

  it('returns a valid JSON string for an empty array', () => {
    const result = JSON.parse(segmentsToJson([]));

    expect(result.segments).toEqual([]);
  });
});
