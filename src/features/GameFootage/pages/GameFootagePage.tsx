import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import useDocumentTitle from '../../../hooks/useDocumentTitle';
import { useVideoExport } from '../../../hooks/useVideoExport';
import { clearBreadcrumbs, setBreadcrumbs } from '../../../redux/BreadcrumbSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  clearSegments,
  createSegment,
  deleteSegment,
  selectSegmentState,
  setPendingEnd,
  setPendingPlayType,
  setPendingStart,
  setPendingTags,
  setPlayType,
  setTags,
} from '../../../redux/SegmentSlice';
import {
  selectVideoState,
  setCurrentTime,
  setDuration,
  setIsPlaying,
  setVideo,
  setYouTubeVideo,
} from '../../../redux/VideoSlice';
import { downloadFile, segmentsToCsv, segmentsToJson } from '../../../utils/exportSegments';
import GameFootageTemplate from '../templates/GameFootageTemplate';

export default function GameFootagePage() {
  const { t } = useTranslation('pageTitles');
  const { t: tCommon } = useTranslation('common');
  const { t: tGameFootage } = useTranslation('gameFootage');
  const dispatch = useAppDispatch();
  const videoState = useAppSelector(selectVideoState);
  const segmentState = useAppSelector(selectSegmentState);
  const videoFileRef = useRef<File | null>(null);
  const { exportZip, isExporting, exportProgress } = useVideoExport();

  useDocumentTitle(t('gameFootage'));

  useEffect(() => {
    dispatch(setBreadcrumbs([
      { label: tCommon('header.goHome'), to: '/' },
      { label: tGameFootage('title') },
    ]));

    return () => {
      dispatch(clearBreadcrumbs());
    };
  }, [dispatch, tCommon, tGameFootage]);

  const handleFileSelect = (file: File) => {
    if (videoState.videoType === 'file' && videoState.videoUrl) {
      URL.revokeObjectURL(videoState.videoUrl);
    }

    videoFileRef.current = file;
    dispatch(clearSegments());
    dispatch(setVideo({ url: URL.createObjectURL(file), fileName: file.name }));
  };

  const handleYouTubeUrl = (videoId: string) => {
    if (videoState.videoType === 'file' && videoState.videoUrl) {
      URL.revokeObjectURL(videoState.videoUrl);
    }

    videoFileRef.current = null;
    dispatch(clearSegments());
    dispatch(setYouTubeVideo({ videoId }));
  };

  return (
    <GameFootageTemplate
      videoType={videoState.videoType}
      videoUrl={videoState.videoUrl}
      videoFileName={videoState.videoFileName}
      youtubeVideoId={videoState.youtubeVideoId}
      currentTime={videoState.currentTime}
      duration={videoState.duration}
      isPlaying={videoState.isPlaying}
      pendingStart={segmentState.pendingStart}
      pendingEnd={segmentState.pendingEnd}
      pendingPlayType={segmentState.pendingPlayType}
      pendingTags={segmentState.pendingTags}
      segments={segmentState.segments}
      onFileSelect={handleFileSelect}
      onYouTubeUrl={handleYouTubeUrl}
      onTimeUpdate={(time) => dispatch(setCurrentTime(time))}
      onDurationChange={(dur) => dispatch(setDuration(dur))}
      onPlayStateChange={(playing) => dispatch(setIsPlaying(playing))}
      onSeek={(time) => dispatch(setCurrentTime(time))}
      onSetStart={() => dispatch(setPendingStart(videoState.currentTime))}
      onSetEnd={() => dispatch(setPendingEnd(videoState.currentTime))}
      onSetPendingPlayType={(pt) => dispatch(setPendingPlayType(pt))}
      onSetPendingTags={(tags) => dispatch(setPendingTags(tags))}
      onCreateSegment={() => dispatch(createSegment())}
      onDeleteSegment={(id) => dispatch(deleteSegment(id))}
      onSetPlayType={(id, pt) => dispatch(setPlayType({ id, playType: pt }))}
      onSetTags={(id, tags) => dispatch(setTags({ id, tags }))}
      onExportCsv={() => downloadFile(segmentsToCsv(segmentState.segments), 'segments.csv', 'text/csv')}
      onExportJson={() => downloadFile(segmentsToJson(segmentState.segments), 'segments.json', 'application/json')}
      onExportZip={() => {
        if (videoFileRef.current) {
          exportZip(videoFileRef.current, segmentState.segments);
        }
      }}
      isExportingZip={isExporting}
      exportZipProgress={exportProgress}
    />
  );
}
