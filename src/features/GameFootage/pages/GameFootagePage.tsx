import { useTranslation } from 'react-i18next';

import useDocumentTitle from '../../../hooks/useDocumentTitle';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  clearSegments,
  createSegment,
  deleteSegment,
  selectSegmentState,
  setPendingEnd,
  setPendingStart,
} from '../../../redux/SegmentSlice';
import { selectVideoState, setCurrentTime, setDuration, setIsPlaying, setVideo } from '../../../redux/VideoSlice';
import GameFootageTemplate from '../templates/GameFootageTemplate';

export default function GameFootagePage() {
  const { t } = useTranslation('pageTitles');
  const dispatch = useAppDispatch();
  const videoState = useAppSelector(selectVideoState);
  const segmentState = useAppSelector(selectSegmentState);

  useDocumentTitle(t('gameFootage'));

  const handleFileSelect = (file: File) => {
    if (videoState.videoUrl) {
      URL.revokeObjectURL(videoState.videoUrl);
    }

    dispatch(clearSegments());
    dispatch(setVideo({ url: URL.createObjectURL(file), fileName: file.name }));
  };

  return (
    <GameFootageTemplate
      videoUrl={videoState.videoUrl}
      videoFileName={videoState.videoFileName}
      currentTime={videoState.currentTime}
      duration={videoState.duration}
      isPlaying={videoState.isPlaying}
      pendingStart={segmentState.pendingStart}
      pendingEnd={segmentState.pendingEnd}
      segments={segmentState.segments}
      onFileSelect={handleFileSelect}
      onTimeUpdate={(time) => dispatch(setCurrentTime(time))}
      onDurationChange={(dur) => dispatch(setDuration(dur))}
      onPlayStateChange={(playing) => dispatch(setIsPlaying(playing))}
      onSeek={(time) => dispatch(setCurrentTime(time))}
      onSetStart={() => dispatch(setPendingStart(videoState.currentTime))}
      onSetEnd={() => dispatch(setPendingEnd(videoState.currentTime))}
      onCreateSegment={() => dispatch(createSegment())}
      onDeleteSegment={(id) => dispatch(deleteSegment(id))}
    />
  );
}
