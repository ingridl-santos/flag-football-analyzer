import { describe, expect, it } from 'vitest';

import { type Segment } from '../redux/SegmentSlice';
import { formatSegmentId, segmentsToCsv, segmentsToJson } from './exportSegments';

const SEGMENTS: Segment[] = [
  { id: 'abc', start: 10, end: 25, duration: 15, playType: 'Pass', tags: ['offense', 'air'] },
  { id: 'def', start: 42, end: 83, duration: 41, playType: 'Run', tags: ['offense', 'rush'] },
  { id: 'ghi', start: 120, end: 122, duration: 2, playType: 'Defense', tags: ['defense', 'quick'] },
];

describe('formatSegmentId', () => {
  it('produces a zero-padded three-digit label for index 0', () => {
    expect(formatSegmentId(0)).toBe('segment_001');
  });

  it('increments the number with the index', () => {
    expect(formatSegmentId(1)).toBe('segment_002');
    expect(formatSegmentId(9)).toBe('segment_010');
    expect(formatSegmentId(99)).toBe('segment_100');
  });
});

describe('segmentsToCsv', () => {
  it('includes the header row', () => {
    const csv = segmentsToCsv(SEGMENTS);

    expect(csv.split('\n')[0]).toBe('clipName,id,start,end,duration,playType,tags');
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

  it('uses a zero-padded segment label as clipName', () => {
    const csv = segmentsToCsv(SEGMENTS);
    const rows = csv.split('\n').slice(1);

    expect(rows[0]).toMatch(/^segment_001,/);
    expect(rows[1]).toMatch(/^segment_002,/);
    expect(rows[2]).toMatch(/^segment_003,/);
  });

  it('handles a segment with no playType or tags', () => {
    const csv = segmentsToCsv([{ id: 'x', start: 0, end: 5, duration: 5 }]);
    const row = csv.split('\n')[1];

    expect(row).toBe('segment_001,x,0,5,5,,');
  });

  it('returns only a header row for an empty array', () => {
    expect(segmentsToCsv([])).toBe('clipName,id,start,end,duration,playType,tags');
  });

  it('quotes a playType that contains a comma', () => {
    const csv = segmentsToCsv([{ id: 'x', start: 0, end: 5, duration: 5, playType: 'Pass,Run' }]);

    expect(csv.split('\n')[1]).toContain('"Pass,Run"');
  });

  it('quotes a tag that contains a comma and doubles internal quotes', () => {
    const csv = segmentsToCsv([{ id: 'x', start: 0, end: 5, duration: 5, tags: ['he said "go"'] }]);

    expect(csv.split('\n')[1]).toContain('"he said ""go"""');
  });
});

describe('segmentsToJson', () => {
  it('wraps segments in a segments key', () => {
    const result = JSON.parse(segmentsToJson(SEGMENTS));

    expect(result).toHaveProperty('segments');
    expect(result.segments).toHaveLength(3);
  });

  it('preserves the original id and adds clipName', () => {
    const result = JSON.parse(segmentsToJson(SEGMENTS));
    const first = result.segments[0];

    expect(first.id).toBe('abc');
    expect(first.clipName).toBe('segment_001');
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
