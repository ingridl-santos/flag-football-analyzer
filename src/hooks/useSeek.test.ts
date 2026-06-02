import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSeek } from './useSeek';

describe('useSeek', () => {
  const seek = vi.fn();
  const onSeekConsumed = vi.fn();

  beforeEach(() => {
    seek.mockClear();
    onSeekConsumed.mockClear();
  });

  it('does not call seek when seekTo is null', () => {
    renderHook(() => useSeek(null, seek, onSeekConsumed));

    expect(seek).not.toHaveBeenCalled();
    expect(onSeekConsumed).not.toHaveBeenCalled();
  });

  it('does not call seek when seekTo is undefined', () => {
    renderHook(() => useSeek(undefined, seek, onSeekConsumed));

    expect(seek).not.toHaveBeenCalled();
    expect(onSeekConsumed).not.toHaveBeenCalled();
  });

  it('calls seek with the correct time when seekTo is set', () => {
    renderHook(() => useSeek(42, seek, undefined));

    expect(seek).toHaveBeenCalledOnce();
    expect(seek).toHaveBeenCalledWith(42);
  });

  it('calls onSeekConsumed exactly once when seekTo is set', () => {
    renderHook(() => useSeek(42, seek, onSeekConsumed));

    expect(onSeekConsumed).toHaveBeenCalledOnce();
  });

  it('does not call onSeekConsumed when seekTo is null', () => {
    renderHook(() => useSeek(null, seek, onSeekConsumed));

    expect(onSeekConsumed).not.toHaveBeenCalled();
  });

  it('calls seek again when seekTo changes to a new value', () => {
    const { rerender } = renderHook(
      ({ seekTo }: { seekTo: number | null }) => useSeek(seekTo, seek, onSeekConsumed),
      { initialProps: { seekTo: 10 as number | null } },
    );

    expect(seek).toHaveBeenCalledTimes(1);
    expect(seek).toHaveBeenCalledWith(10);

    rerender({ seekTo: 55 });

    expect(seek).toHaveBeenCalledTimes(2);
    expect(seek).toHaveBeenLastCalledWith(55);
    expect(onSeekConsumed).toHaveBeenCalledTimes(2);
  });

  it('does not seek again when seekTo is cleared to null', () => {
    const { rerender } = renderHook(
      ({ seekTo }: { seekTo: number | null }) => useSeek(seekTo, seek, onSeekConsumed),
      { initialProps: { seekTo: 30 as number | null } },
    );

    seek.mockClear();
    onSeekConsumed.mockClear();

    rerender({ seekTo: null });

    expect(seek).not.toHaveBeenCalled();
    expect(onSeekConsumed).not.toHaveBeenCalled();
  });
});
