import { useEffect, useRef } from 'react';

/**
 * Fires `seek(seekTo)` and `onSeekConsumed()` whenever `seekTo` transitions
 * from null/undefined to a numeric value. Using a ref for `onSeekConsumed`
 * keeps the effect stable without requiring callers to memoize the callback.
 */
export function useSeek(
  seekTo: number | null | undefined,
  seek: (time: number) => void,
  onSeekConsumed: (() => void) | undefined,
): void {
  const onSeekConsumedRef = useRef(onSeekConsumed);
  onSeekConsumedRef.current = onSeekConsumed;

  useEffect(() => {
    if (seekTo != null) {
      seek(seekTo);
      onSeekConsumedRef.current?.();
    }
  }, [seekTo, seek]);
}
