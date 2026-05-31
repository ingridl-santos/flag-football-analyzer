import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Segment } from '../redux/SegmentSlice';
import { useActiveSegmentId } from './useActiveSegmentId';

const makeSegment = (id: string, start: number, end: number): Segment => ({
  id,
  start,
  end,
  duration: end - start,
});

describe('useActiveSegmentId', () => {
  it('returns null when segments array is empty', () => {
    const { result } = renderHook(() => useActiveSegmentId([], 5));

    expect(result.current).toBeNull();
  });

  it('returns the id of the segment containing currentTime', () => {
    const segments = [makeSegment('a', 0, 10), makeSegment('b', 20, 30)];
    const { result } = renderHook(() => useActiveSegmentId(segments, 25));

    expect(result.current).toBe('b');
  });

  it('returns null when currentTime is outside all segments', () => {
    const segments = [makeSegment('a', 0, 10), makeSegment('b', 20, 30)];
    const { result } = renderHook(() => useActiveSegmentId(segments, 15));

    expect(result.current).toBeNull();
  });

  it('matches on the start boundary (inclusive)', () => {
    const segments = [makeSegment('a', 5, 15)];
    const { result } = renderHook(() => useActiveSegmentId(segments, 5));

    expect(result.current).toBe('a');
  });

  it('matches on the end boundary (inclusive)', () => {
    const segments = [makeSegment('a', 5, 15)];
    const { result } = renderHook(() => useActiveSegmentId(segments, 15));

    expect(result.current).toBe('a');
  });

  it('returns null when currentTime is just before a segment', () => {
    const segments = [makeSegment('a', 5, 15)];
    const { result } = renderHook(() => useActiveSegmentId(segments, 4.99));

    expect(result.current).toBeNull();
  });

  it('returns null when currentTime is just after a segment', () => {
    const segments = [makeSegment('a', 5, 15)];
    const { result } = renderHook(() => useActiveSegmentId(segments, 15.01));

    expect(result.current).toBeNull();
  });

  it('returns the first matching segment when ranges overlap', () => {
    const segments = [makeSegment('a', 0, 20), makeSegment('b', 10, 30)];
    const { result } = renderHook(() => useActiveSegmentId(segments, 15));

    expect(result.current).toBe('a');
  });
});
