import { useEffect, useRef } from 'react';

// Minimal YouTube IFrame Player API type declarations
interface YTPlayerInstance {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  destroy(): void;
}

interface YTPlayerConfig {
  videoId: string;
  playerVars?: Record<string, number | string>;
  events?: {
    onReady?: (event: { target: YTPlayerInstance }) => void;
    onStateChange?: (event: { data: number }) => void;
  };
}

declare global {
  interface Window {
    YT?: {
      Player: new (element: HTMLElement, config: YTPlayerConfig) => YTPlayerInstance;
      PlayerState: {
        UNSTARTED: -1;
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YT_SCRIPT_ID = 'youtube-iframe-api';
const POLL_INTERVAL_MS = 250;

function appendYTScript(): void {
  if (document.getElementById(YT_SCRIPT_ID)) return;

  const script = document.createElement('script');

  script.id = YT_SCRIPT_ID;
  script.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(script);
}

export interface UseYouTubePlayerReturn {
  containerRef: React.RefObject<HTMLDivElement>;
  seek: (time: number) => void;
  togglePlay: () => void;
}

export default function useYouTubePlayer(
  videoId: string,
  onTimeUpdate: (time: number) => void,
  onDurationChange: (duration: number) => void,
  onPlayStateChange: (isPlaying: boolean) => void,
): UseYouTubePlayerReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep callbacks stable without re-running the effect
  const callbacksRef = useRef({ onTimeUpdate, onDurationChange, onPlayStateChange });

  callbacksRef.current = { onTimeUpdate, onDurationChange, onPlayStateChange };

  const stopPolling = (): void => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    const initPlayer = (): void => {
      if (!containerRef.current || !window.YT?.Player) return;

      playerRef.current?.destroy();
      stopPolling();

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onReady: ({ target }) => {
            callbacksRef.current.onDurationChange(target.getDuration());
          },
          onStateChange: ({ data }) => {
            const isPlaying = data === 1; // YT.PlayerState.PLAYING

            callbacksRef.current.onPlayStateChange(isPlaying);

            if (isPlaying) {
              intervalRef.current = setInterval(() => {
                if (playerRef.current) {
                  callbacksRef.current.onTimeUpdate(playerRef.current.getCurrentTime());
                }
              }, POLL_INTERVAL_MS);
            } else {
              stopPolling();
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        initPlayer();
      };
      appendYTScript();
    }

    return () => {
      stopPolling();
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  const seek = (time: number): void => {
    playerRef.current?.seekTo(time, true);
  };

  const togglePlay = (): void => {
    if (!playerRef.current) return;

    const state = playerRef.current.getPlayerState();

    if (state === 1) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  return { containerRef, seek, togglePlay };
}
