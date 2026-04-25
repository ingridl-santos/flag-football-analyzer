import { act, renderHook } from '@testing-library/react';

import useVideoPlayer from './useVideoPlayer';

describe('useVideoPlayer', () => {
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
    function attachMockVideo(
      ref: React.RefObject<HTMLVideoElement | null>,
      overrides: Partial<HTMLVideoElement>,
    ) {
      const mockVideo = {
        paused: true,
        currentTime: 0,
        play: vi.fn().mockResolvedValue(undefined),
        pause: vi.fn(),
        ...overrides,
      } as unknown as HTMLVideoElement;

      Object.defineProperty(ref, 'current', { value: mockVideo, writable: true });

      return mockVideo;
    }

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

      act(() => result.current.togglePlay());

      expect(mock.pause).toHaveBeenCalledTimes(1);
      expect(mock.play).not.toHaveBeenCalled();
    });
  });
});
