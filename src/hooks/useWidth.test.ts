import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@mui/material', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@mui/material')>();
  return {
    ...actual,
    useTheme: () => ({
      breakpoints: {
        only: (bp: string) => `@media (--${bp})`,
      },
    }),
    useMediaQuery: vi.fn().mockReturnValue(false),
  };
});

import { useMediaQuery } from '@mui/material';
import useWidth from './useWidth';

describe('useWidth', () => {
  const mockUseMediaQuery = vi.mocked(useMediaQuery);

  afterEach(() => {
    mockUseMediaQuery.mockReturnValue(false);
  });

  it('returns "xs" when no breakpoint matches', () => {
    const { result } = renderHook(() => useWidth());

    expect(result.current).toBe('xs');
  });

  it.each(['xl', 'lg', 'md', 'sm', 'xs'] as const)(
    'returns "%s" when only that breakpoint matches',
    (bp) => {
      mockUseMediaQuery.mockImplementation(
        (query: unknown) => typeof query === 'string' && query.includes(bp),
      );

      const { result } = renderHook(() => useWidth());

      expect(result.current).toBe(bp);
    },
  );

  it('returns the largest matching breakpoint when multiple match', () => {
    // xl and md both match — should return xl (largest, checked first)
    mockUseMediaQuery.mockImplementation(
      (query: unknown) =>
        typeof query === 'string' && (query.includes('xl') || query.includes('md')),
    );

    const { result } = renderHook(() => useWidth());

    expect(result.current).toBe('xl');
  });
});
