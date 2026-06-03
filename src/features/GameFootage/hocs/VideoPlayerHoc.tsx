import { MutableRefObject, ReactNode, useCallback } from 'react';

import { useActiveSegmentId } from '../../../hooks/useActiveSegmentId';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  clearSegments,
  selectSegmentState,
} from '../../../redux/SegmentSlice';
import {
  consumeSeek,
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
  controls?: ReactNode;
}

export default function VideoPlayerHoc({ videoFileRef, controls }: VideoPlayerHocProps) {
  const dispatch = useAppDispatch();
  const videoState = useAppSelector(selectVideoState);
  const { segments } = useAppSelector(selectSegmentState);

  const activeSegmentId = useActiveSegmentId(segments, videoState.currentTime);

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

  const handleTimeUpdate = useCallback((time: number) => {
    dispatch(setCurrentTime(time));
  }, [dispatch]);

  const handleDurationChange = useCallback((dur: number) => {
    dispatch(setDuration(dur));
  }, [dispatch]);

  const handlePlayStateChange = useCallback((playing: boolean) => {
    dispatch(setIsPlaying(playing));
  }, [dispatch]);

  const handleSeek = useCallback((time: number) => {
    dispatch(setCurrentTime(time));
  }, [dispatch]);

  const handleSeekConsumed = useCallback(() => {
    dispatch(consumeSeek());
  }, [dispatch]);

  return (
    <VideoPlayerSection
      videoType={videoState.videoType}
      videoUrl={videoState.videoUrl}
      controls={controls}
      videoFileName={videoState.videoFileName}
      youtubeVideoId={videoState.youtubeVideoId}
      currentTime={videoState.currentTime}
      duration={videoState.duration}
      isPlaying={videoState.isPlaying}
      seekTo={videoState.seekTo}
      segments={segments}
      activeSegmentId={activeSegmentId}
      onFileSelect={handleFileSelect}
      onYouTubeUrl={handleYouTubeUrl}
      onTimeUpdate={handleTimeUpdate}
      onDurationChange={handleDurationChange}
      onPlayStateChange={handlePlayStateChange}
      onSeek={handleSeek}
      onSeekConsumed={handleSeekConsumed}
      onSegmentClick={handleSegmentClick}
    />
  );
}
