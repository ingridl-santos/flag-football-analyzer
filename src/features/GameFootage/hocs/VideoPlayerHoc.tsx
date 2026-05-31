import { MutableRefObject, useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  clearSegments,
  selectSegmentState,
} from '../../../redux/SegmentSlice';
import {
  selectVideoState,
  setCurrentTime,
  setDuration,
  setIsPlaying,
  setVideo,
  setYouTubeVideo,
} from '../../../redux/VideoSlice';
import VideoPlayerSection from '../components/VideoPlayerSection';

export interface VideoPlayerHocProps {
  videoFileRef: MutableRefObject<File | null>;
}

export default function VideoPlayerHoc({ videoFileRef }: VideoPlayerHocProps) {
  const dispatch = useAppDispatch();
  const videoState = useAppSelector(selectVideoState);
  const { segments } = useAppSelector(selectSegmentState);

  const activeSegmentId = segments.find(
    (s) => videoState.currentTime >= s.start && videoState.currentTime <= s.end,
  )?.id ?? null;

  const handleFileSelect = useCallback((file: File) => {
    if (videoState.videoType === 'file' && videoState.videoUrl) {
      URL.revokeObjectURL(videoState.videoUrl);
    }

    videoFileRef.current = file;
    dispatch(clearSegments());
    dispatch(setVideo({ url: URL.createObjectURL(file), fileName: file.name }));
  }, [dispatch, videoState.videoType, videoState.videoUrl]);

  const handleYouTubeUrl = useCallback((videoId: string) => {
    if (videoState.videoType === 'file' && videoState.videoUrl) {
      URL.revokeObjectURL(videoState.videoUrl);
    }

    videoFileRef.current = null;
    dispatch(clearSegments());
    dispatch(setYouTubeVideo({ videoId }));
  }, [dispatch, videoState.videoType, videoState.videoUrl]);

  const handleSegmentClick = useCallback((id: string) => {
    const segment = segments.find((s) => s.id === id);

    if (segment) dispatch(setCurrentTime(segment.start));
  }, [dispatch, segments]);

  return (
    <VideoPlayerSection
      videoType={videoState.videoType}
      videoUrl={videoState.videoUrl}
      videoFileName={videoState.videoFileName}
      youtubeVideoId={videoState.youtubeVideoId}
      currentTime={videoState.currentTime}
      duration={videoState.duration}
      isPlaying={videoState.isPlaying}
      segments={segments}
      activeSegmentId={activeSegmentId}
      onFileSelect={handleFileSelect}
      onYouTubeUrl={handleYouTubeUrl}
      onTimeUpdate={(time) => dispatch(setCurrentTime(time))}
      onDurationChange={(dur) => dispatch(setDuration(dur))}
      onPlayStateChange={(playing) => dispatch(setIsPlaying(playing))}
      onSeek={(time) => dispatch(setCurrentTime(time))}
      onSegmentClick={handleSegmentClick}
    />
  );
}
