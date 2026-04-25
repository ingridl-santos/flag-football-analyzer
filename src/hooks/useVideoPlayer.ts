import { RefObject, useCallback, useRef } from 'react';

export interface UseVideoPlayerReturn {
  videoRef: RefObject<HTMLVideoElement>;
  seek: (time: number) => void;
  togglePlay: () => void;
}

export default function useVideoPlayer(): UseVideoPlayerReturn {
  const videoRef = useRef<HTMLVideoElement>(null) as RefObject<HTMLVideoElement>;

  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  return { videoRef, seek, togglePlay };
}
