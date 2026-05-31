import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useYouTubePlayer from './useYouTubePlayer';

function makeMockPlayer() {
  return {
    playVideo: vi.fn(),
    pauseVideo: vi.fn(),
    seekTo: vi.fn(),
    getCurrentTime: vi.fn(() => 5),
    getDuration: vi.fn(() => 100),
    getPlayerState: vi.fn(() => 2),
    destroy: vi.fn(),
  };
}

function TestPlayer({
  videoId,
  isPlaying = false,
  onTimeUpdate = vi.fn(),
  onDurationChange = vi.fn(),
  onPlayStateChange = vi.fn(),
  onReady,
}: {
  videoId: string;
  isPlaying?: boolean;
  onTimeUpdate?: (t: number) => void;
  onDurationChange?: (d: number) => void;
  onPlayStateChange?: (p: boolean) => void;
  onReady?: (controls: { seek: (t: number) => void; togglePlay: () => void }) => void;
}) {
  const { containerRef, seek, togglePlay } = useYouTubePlayer(
    videoId,
    onTimeUpdate,
    onDurationChange,
    onPlayStateChange,
    isPlaying,
  );

  onReady?.({ seek, togglePlay });

  return <div ref={containerRef} />;
}

describe('useYouTubePlayer', () => {
  let mockPlayer: ReturnType<typeof makeMockPlayer>;
  let YTPlayerConstructor: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockPlayer = makeMockPlayer();
    YTPlayerConstructor = vi.fn(function (_element, config) {
      config.events?.onReady?.({ target: mockPlayer });

      return mockPlayer;
    });

    vi.stubGlobal('YT', undefined);
    vi.stubGlobal('onYouTubeIframeAPIReady', undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('seek does nothing when player is not initialized', () => {
    let controls: { seek: (t: number) => void; togglePlay: () => void } | undefined;

    render(
      <TestPlayer
        videoId="abc"
        onReady={(c) => {
          controls = c;
        }}
      />,
    );

    expect(() => act(() => controls?.seek(10))).not.toThrow();
  });

  it('togglePlay does nothing when player is not initialized', () => {
    let controls: { seek: (t: number) => void; togglePlay: () => void } | undefined;

    render(
      <TestPlayer
        videoId="abc"
        onReady={(c) => {
          controls = c;
        }}
      />,
    );

    expect(() => act(() => controls?.togglePlay())).not.toThrow();
  });

  describe('after the YT API becomes ready', () => {
    function setupPlayer(videoId = 'video123') {
      let controls: { seek: (t: number) => void; togglePlay: () => void } | undefined;
      const onDurationChange = vi.fn();
      const onPlayStateChange = vi.fn();
      const onTimeUpdate = vi.fn();

      render(
        <TestPlayer
          videoId={videoId}
          onDurationChange={onDurationChange}
          onPlayStateChange={onPlayStateChange}
          onTimeUpdate={onTimeUpdate}
          onReady={(c) => {
            controls = c;
          }}
        />,
      );

      act(() => {
        window.YT = {
          Player: YTPlayerConstructor as unknown as NonNullable<Window['YT']>['Player'],
          PlayerState: { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 },
        };
        window.onYouTubeIframeAPIReady?.();
      });

      return { controls: controls!, onDurationChange, onPlayStateChange, onTimeUpdate };
    }

    it('creates a YT.Player with the given videoId', () => {
      setupPlayer('video123');

      expect(YTPlayerConstructor).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({ videoId: 'video123' }),
      );
    });

    it('calls onDurationChange with the video duration on ready', () => {
      const { onDurationChange } = setupPlayer();

      expect(onDurationChange).toHaveBeenCalledWith(100);
    });

    it('seek calls seekTo on the player', () => {
      const { controls } = setupPlayer();

      act(() => controls.seek(42));

      expect(mockPlayer.seekTo).toHaveBeenCalledWith(42, true);
    });

    it('togglePlay calls playVideo when player is paused', () => {
      mockPlayer.getPlayerState.mockReturnValue(2);
      const { controls } = setupPlayer();

      act(() => controls.togglePlay());

      expect(mockPlayer.playVideo).toHaveBeenCalledTimes(1);
      expect(mockPlayer.pauseVideo).not.toHaveBeenCalled();
    });

    it('togglePlay calls pauseVideo when player is playing', () => {
      mockPlayer.getPlayerState.mockReturnValue(1);
      const { controls } = setupPlayer();

      mockPlayer.pauseVideo.mockClear();

      act(() => controls.togglePlay());

      expect(mockPlayer.pauseVideo).toHaveBeenCalledTimes(1);
      expect(mockPlayer.playVideo).not.toHaveBeenCalled();
    });

    it('calls pauseVideo when isPlaying prop changes to false while playing', () => {
      mockPlayer.getPlayerState.mockReturnValue(1);

      const { rerender } = render(
        <TestPlayer videoId="video123" isPlaying />,
      );

      act(() => {
        window.YT = {
          Player: YTPlayerConstructor as unknown as NonNullable<Window['YT']>['Player'],
          PlayerState: { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 },
        };
        window.onYouTubeIframeAPIReady?.();
      });

      mockPlayer.pauseVideo.mockClear();

      act(() => rerender(<TestPlayer videoId="video123" isPlaying={false} />));

      expect(mockPlayer.pauseVideo).toHaveBeenCalledTimes(1);
      expect(mockPlayer.playVideo).not.toHaveBeenCalled();
    });

    it('calls playVideo when isPlaying prop changes to true while paused', () => {
      mockPlayer.getPlayerState.mockReturnValue(2);

      const { rerender } = render(
        <TestPlayer videoId="video123" isPlaying={false} />,
      );

      act(() => {
        window.YT = {
          Player: YTPlayerConstructor as unknown as NonNullable<Window['YT']>['Player'],
          PlayerState: { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 },
        };
        window.onYouTubeIframeAPIReady?.();
      });

      mockPlayer.playVideo.mockClear();

      act(() => rerender(<TestPlayer videoId="video123" isPlaying />));

      expect(mockPlayer.playVideo).toHaveBeenCalledTimes(1);
      expect(mockPlayer.pauseVideo).not.toHaveBeenCalled();
    });

    it('calls playVideo on ready when isPlaying is true at mount and player is paused', () => {
      mockPlayer.getPlayerState.mockReturnValue(2);

      render(<TestPlayer videoId="video123" isPlaying />);

      act(() => {
        window.YT = {
          Player: YTPlayerConstructor as unknown as NonNullable<Window['YT']>['Player'],
          PlayerState: { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 },
        };
        window.onYouTubeIframeAPIReady?.();
      });

      expect(mockPlayer.playVideo).toHaveBeenCalledTimes(1);
      expect(mockPlayer.pauseVideo).not.toHaveBeenCalled();
    });

    it('does not call playVideo on ready when isPlaying is true but player is already playing', () => {
      mockPlayer.getPlayerState.mockReturnValue(1);

      render(<TestPlayer videoId="video123" isPlaying />);

      act(() => {
        window.YT = {
          Player: YTPlayerConstructor as unknown as NonNullable<Window['YT']>['Player'],
          PlayerState: { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 },
        };
        window.onYouTubeIframeAPIReady?.();
      });

      expect(mockPlayer.playVideo).not.toHaveBeenCalled();
    });
  });
});
