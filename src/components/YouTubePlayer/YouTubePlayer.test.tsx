import { act, render } from '@testing-library/react';
import { vi } from 'vitest';

import YouTubePlayer from '.';

const mockSeek = vi.fn<(time: number) => boolean>().mockReturnValue(true);

vi.mock('../../hooks/useYouTubePlayer', () => ({
  default: () => ({
    containerRef: { current: null },
    seek: mockSeek,
    togglePlay: vi.fn(),
  }),
}));

function renderPlayer(props: Partial<React.ComponentProps<typeof YouTubePlayer>> = {}) {
  return render(
    <YouTubePlayer
      videoId="abc123"
      currentTime={0}
      duration={180}
      isPlaying={false}
      onTimeUpdate={vi.fn()}
      onDurationChange={vi.fn()}
      onPlayStateChange={vi.fn()}
      {...props}
    />,
  );
}

describe('YouTubePlayer — seekTo behaviour', () => {
  beforeEach(() => {
    mockSeek.mockClear();
  });

  it('does not call seek when seekTo is null', () => {
    renderPlayer({ seekTo: null });

    expect(mockSeek).not.toHaveBeenCalled();
  });

  it('does not call seek when seekTo is undefined', () => {
    renderPlayer({ seekTo: undefined });

    expect(mockSeek).not.toHaveBeenCalled();
  });

  it('calls seek with the correct time when seekTo is set', () => {
    renderPlayer({ seekTo: 42 });

    expect(mockSeek).toHaveBeenCalledTimes(1);
    expect(mockSeek).toHaveBeenCalledWith(42);
  });

  it('calls onSeekConsumed exactly once when seekTo is set', () => {
    const onSeekConsumed = vi.fn();

    renderPlayer({ seekTo: 42, onSeekConsumed });

    expect(onSeekConsumed).toHaveBeenCalledTimes(1);
  });

  it('does not call onSeekConsumed when seekTo is null', () => {
    const onSeekConsumed = vi.fn();

    renderPlayer({ seekTo: null, onSeekConsumed });

    expect(onSeekConsumed).not.toHaveBeenCalled();
  });

  it('calls seek again when seekTo changes to a new value', () => {
    const onSeekConsumed = vi.fn();
    const { rerender } = renderPlayer({ seekTo: 10, onSeekConsumed });

    expect(mockSeek).toHaveBeenCalledTimes(1);
    expect(mockSeek).toHaveBeenCalledWith(10);

    act(() => {
      rerender(
        <YouTubePlayer
          videoId="abc123"
          currentTime={10}
          duration={180}
          isPlaying={false}
          onTimeUpdate={vi.fn()}
          onDurationChange={vi.fn()}
          onPlayStateChange={vi.fn()}
          seekTo={55}
          onSeekConsumed={onSeekConsumed}
        />,
      );
    });

    expect(mockSeek).toHaveBeenCalledTimes(2);
    expect(mockSeek).toHaveBeenLastCalledWith(55);
    expect(onSeekConsumed).toHaveBeenCalledTimes(2);
  });

  it('does not seek again when seekTo is cleared back to null', () => {
    const onSeekConsumed = vi.fn();
    const { rerender } = renderPlayer({ seekTo: 30, onSeekConsumed });

    mockSeek.mockClear();
    onSeekConsumed.mockClear();

    act(() => {
      rerender(
        <YouTubePlayer
          videoId="abc123"
          currentTime={30}
          duration={180}
          isPlaying={false}
          onTimeUpdate={vi.fn()}
          onDurationChange={vi.fn()}
          onPlayStateChange={vi.fn()}
          seekTo={null}
          onSeekConsumed={onSeekConsumed}
        />,
      );
    });

    expect(mockSeek).not.toHaveBeenCalled();
    expect(onSeekConsumed).not.toHaveBeenCalled();
  });
});
