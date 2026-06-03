import { useEffect, useRef } from 'react';

/**
 * Fires `seek(seekTo)` and `onSeekConsumed()` whenever `seekTo` changes to a
 * non-null/undefined numeric value (i.e. on every `seekTo` change while it is
 * set, including transitions between different numbers). `onSeekConsumed` is
 * only called when `seek` returns `true`, so a not-yet-ready player can signal
 * failure by returning `false` and the seek request will be retried on the next
 * `seekTo` change. Both callbacks are held in refs so the effect is driven
 * solely by `seekTo` — callers do not need to memoize their functions.
 */
export function useSeek(
  seekTo: number | null | undefined,
  seek: (time: number) => boolean,
  onSeekConsumed: (() => void) | undefined,
): void {
  const seekRef = useRef(seek);
  seekRef.current = seek;

  const onSeekConsumedRef = useRef(onSeekConsumed);
  onSeekConsumedRef.current = onSeekConsumed;

  useEffect(() => {
    if (seekTo != null) {
      const success = seekRef.current(seekTo);
      if (success) onSeekConsumedRef.current?.();
    }
  }, [seekTo]);
}
