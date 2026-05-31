import { useMemo } from 'react';

import type { Segment } from '../redux/SegmentSlice';

export function useActiveSegmentId(segments: Segment[], currentTime: number): string | null {
  return useMemo(
    () => segments.find((s) => currentTime >= s.start && currentTime <= s.end)?.id ?? null,
    [segments, currentTime],
  );
}
