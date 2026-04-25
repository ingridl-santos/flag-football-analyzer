/**
 * Formats a duration in seconds as M:SS (e.g. 83 → "1:23").
 * Negative values are clamped to 0. Fractional seconds are floored.
 */
export function formatTime(seconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
