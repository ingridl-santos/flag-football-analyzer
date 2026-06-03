import { RefCallback, useCallback, useEffect, useRef, useState } from 'react';

export interface UseVideoPlayerReturn {
  videoRef: RefCallback<HTMLVideoElement>;
  seek: (time: number) => boolean;
  togglePlay: () => void;
}

export default function useVideoPlayer(isPlaying = false): UseVideoPlayerReturn {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const videoEl = useRef<HTMLVideoElement | null>(null);

  const videoRef = useCallback((el: HTMLVideoElement | null) => {
    videoEl.current = el;
    setVideo(el);
  }, []);

  useEffect(() => {
    if (!video) return;
    if (isPlaying && video.paused) {
      video.play().catch(() => {});
    } else if (!isPlaying && !video.paused) {
      video.pause();
    }
  }, [isPlaying, video]);

  const seek = useCallback((time: number): boolean => {
    if (videoEl.current) {
      videoEl.current.currentTime = time;
      return true;
    }
    return false;
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoEl.current;

    if (!v) return;

    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, []);

  return { videoRef, seek, togglePlay };
}
