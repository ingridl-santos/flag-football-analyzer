import { useEffect, useRef } from 'react';

/**
 * Fires `seek(seekTo)` and `onSeekConsumed()` whenever `seekTo` transitions
 * from null/undefined to a numeric value. Both callbacks are held in refs so
 * the effect is driven solely by `seekTo` — callers do not need to memoize
 * their `seek` or `onSeekConsumed` functions.
 */
export function useSeek(
  seekTo: number | null | undefined,
  seek: (time: number) => void,
  onSeekConsumed: (() => void) | undefined,
): void {
  const seekRef = useRef(seek);
  seekRef.current = seek;

  const onSeekConsumedRef = useRef(onSeekConsumed);
  onSeekConsumedRef.current = onSeekConsumed;

  useEffect(() => {
    if (seekTo != null) {
      seekRef.current(seekTo);
      onSeekConsumedRef.current?.();
    }
  }, [seekTo]);
}
