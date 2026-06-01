import { act, renderHook } from '@testing-library/react';

import useVideoPlayer from './useVideoPlayer';

describe('useVideoPlayer', () => {
  function attachMockVideo(
    videoRef: (el: HTMLVideoElement | null) => void,
    overrides: Omit<Partial<HTMLVideoElement>, 'play' | 'pause'>,
  ) {
    const mockVideo = {
      paused: true,
      currentTime: 0,
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      ...overrides,
    };

    act(() => videoRef(mockVideo as unknown as HTMLVideoElement));

    return mockVideo;
  }

  it('returns videoRef, seek, and togglePlay', () => {
    const { result } = renderHook(() => useVideoPlayer());

    expect(result.current.videoRef).toBeDefined();
    expect(typeof result.current.seek).toBe('function');
    expect(typeof result.current.togglePlay).toBe('function');
  });

  it('seek does nothing when videoRef.current is null', () => {
    const { result } = renderHook(() => useVideoPlayer());

    expect(() => {
      act(() => result.current.seek(10));
    }).not.toThrow();
  });

  it('togglePlay does nothing when videoRef.current is null', () => {
    const { result } = renderHook(() => useVideoPlayer());

    expect(() => {
      act(() => result.current.togglePlay());
    }).not.toThrow();
  });

  describe('with a mocked video element', () => {
    it('seek sets currentTime on the video element', () => {
      const { result } = renderHook(() => useVideoPlayer());
      const mock = attachMockVideo(result.current.videoRef, {});

      act(() => result.current.seek(42));

      expect(mock.currentTime).toBe(42);
    });

    it('togglePlay calls play() when the video is paused', () => {
      const { result } = renderHook(() => useVideoPlayer());
      const mock = attachMockVideo(result.current.videoRef, { paused: true });

      act(() => result.current.togglePlay());

      expect(mock.play).toHaveBeenCalledTimes(1);
      expect(mock.pause).not.toHaveBeenCalled();
    });

    it('togglePlay calls pause() when the video is playing', () => {
      const { result } = renderHook(() => useVideoPlayer());
      const mock = attachMockVideo(result.current.videoRef, { paused: false });

      mock.pause.mockClear();

      act(() => result.current.togglePlay());

      expect(mock.pause).toHaveBeenCalledTimes(1);
      expect(mock.play).not.toHaveBeenCalled();
    });
  });

  describe('isPlaying sync', () => {
    it('plays the video when isPlaying becomes true and the video is paused', () => {
      const { result, rerender } = renderHook(({ p }: { p: boolean }) => useVideoPlayer(p), {
        initialProps: { p: false },
      });
      const mock = attachMockVideo(result.current.videoRef, { paused: true });

      act(() => rerender({ p: true }));

      expect(mock.play).toHaveBeenCalledTimes(1);
      expect(mock.pause).not.toHaveBeenCalled();
    });

    it('pauses the video when isPlaying becomes false and the video is playing', () => {
      const { result, rerender } = renderHook(({ p }: { p: boolean }) => useVideoPlayer(p), {
        initialProps: { p: true },
      });
      const mock = attachMockVideo(result.current.videoRef, { paused: false });

      act(() => rerender({ p: false }));

      expect(mock.pause).toHaveBeenCalledTimes(1);
      expect(mock.play).not.toHaveBeenCalled();
    });

    it('does not call play when isPlaying is true but the video is already playing', () => {
      const { result, rerender } = renderHook(({ p }: { p: boolean }) => useVideoPlayer(p), {
        initialProps: { p: false },
      });
      const mock = attachMockVideo(result.current.videoRef, { paused: false });

      act(() => rerender({ p: true }));

      expect(mock.play).not.toHaveBeenCalled();
    });

    it('does not call pause when isPlaying is false but the video is already paused', () => {
      const { result, rerender } = renderHook(({ p }: { p: boolean }) => useVideoPlayer(p), {
        initialProps: { p: true },
      });
      const mock = attachMockVideo(result.current.videoRef, { paused: true });

      act(() => rerender({ p: false }));

      expect(mock.pause).not.toHaveBeenCalled();
    });
  });
});
