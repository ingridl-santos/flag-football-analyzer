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
    getPlayerState: vi.fn(() => 2), // PAUSED
    destroy: vi.fn(),
  };
}

// Test component that attaches the containerRef to the DOM
function TestPlayer({
  videoId,
  onTimeUpdate = vi.fn(),
  onDurationChange = vi.fn(),
  onPlayStateChange = vi.fn(),
  onReady,
}: {
  videoId: string;
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
      mockPlayer.getPlayerState.mockReturnValue(2); // PAUSED
      const { controls } = setupPlayer();

      act(() => controls.togglePlay());

      expect(mockPlayer.playVideo).toHaveBeenCalledTimes(1);
      expect(mockPlayer.pauseVideo).not.toHaveBeenCalled();
    });

    it('togglePlay calls pauseVideo when player is playing', () => {
      mockPlayer.getPlayerState.mockReturnValue(1); // PLAYING
      const { controls } = setupPlayer();

      act(() => controls.togglePlay());

      expect(mockPlayer.pauseVideo).toHaveBeenCalledTimes(1);
      expect(mockPlayer.playVideo).not.toHaveBeenCalled();
    });
  });
});
