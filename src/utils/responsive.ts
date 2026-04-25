import { Breakpoint } from '@mui/material';

import { breakpointsDescendingSize } from '../theme/constants/breakpoints';
import { ResponsiveValue } from '../theme/types/ResponsiveValue';

/**
 * Resolves a plain value or responsive value map to the concrete value for the current breakpoint.
 * If the current breakpoint has no entry, falls back to the next smaller breakpoint until one is found.
 * Returns `undefined` if no matching breakpoint is found.
 * (essentially works just like the sx values in MUI)
 *
 * @example
 * resolveResponsive({ xs: 1, md: 3 }, 'lg') // → 3 (falls back to 'md')
 * resolveResponsive(2, 'md')                 // → 2 (plain value returned as-is)
 */
export function resolveResponsive<T>(
  value: T | ResponsiveValue<T>,
  current: Breakpoint,
): T | undefined {
  if (value === null || typeof value !== 'object') return value as T;

  const map = value as ResponsiveValue<T>;
  const key = breakpointsDescendingSize
    .slice(breakpointsDescendingSize.indexOf(current))
    .find((bp) => map[bp] !== undefined);

  return key ? map[key] : undefined;
}
