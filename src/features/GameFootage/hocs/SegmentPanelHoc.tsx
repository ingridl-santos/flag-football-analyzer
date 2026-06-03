import { RefObject, useCallback, useState } from 'react';

import { useActiveSegmentId } from '../../../hooks/useActiveSegmentId';
import { useVideoExport } from '../../../hooks/useVideoExport';
import { selectAnalysisState } from '../../../redux/AnalysisSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  deleteSegment,
  selectSegmentState,
  setDown,
  setPlayer,
  setPlayType,
  setResult,
  setSide,
  setTags,
  type PlayDown,
  type PlaySide,
} from '../../../redux/SegmentSlice';
import { requestSeek, selectVideoState, setCurrentTime, setIsPlaying } from '../../../redux/VideoSlice';
import { downloadFile, segmentsToCsv, segmentsToJson } from '../../../utils/exportSegments';
import SegmentPanel from '../components/SegmentPanel';

export interface SegmentPanelHocProps {
  videoFileRef: RefObject<File>;
  videoPlayerRef: RefObject<HTMLDivElement>;
}

export default function SegmentPanelHoc({ videoFileRef, videoPlayerRef }: SegmentPanelHocProps) {
  const dispatch = useAppDispatch();
  const { videoType, currentTime } = useAppSelector(selectVideoState);
  const { segments } = useAppSelector(selectSegmentState);
  const { mode } = useAppSelector(selectAnalysisState);
  const { exportZip, isExporting, exportProgress, exportError } = useVideoExport();

  const activeSegmentId = useActiveSegmentId(segments, currentTime);

  // Separate from playback-position activeSegmentId — tracks which segment the
  // coach explicitly clicked to classify. Stays pinned while the user types,
  // even if the video plays past the segment.
  const [classifierSegmentId, setClassifierSegmentId] = useState<string | null>(null);
  const classifierSegment = classifierSegmentId
    ? (segments.find((s) => s.id === classifierSegmentId) ?? null)
    : null;

  const handleSegmentClick = useCallback((id: string) => {
    const segment = segments.find((s) => s.id === id);

    if (!segment) return;

    dispatch(requestSeek(segment.start));
    dispatch(setCurrentTime(segment.start));

    if (mode === 'tag') {
      dispatch(setIsPlaying(true));
      setClassifierSegmentId(id);
    }

    videoPlayerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [dispatch, segments, mode, videoPlayerRef]);

  const handleDelete = useCallback((id: string) => {
    dispatch(deleteSegment(id));
    setClassifierSegmentId((prev) => prev === id ? null : prev);
  }, [dispatch]);

  const handleSetSide = useCallback((id: string, side: PlaySide | undefined) => {
    dispatch(setSide({ id, side }));
  }, [dispatch]);

  const handleSetDown = useCallback((id: string, down: PlayDown | undefined) => {
    dispatch(setDown({ id, down }));
  }, [dispatch]);

  const handleSetPlayType = useCallback((id: string, playType: string | undefined) => {
    dispatch(setPlayType({ id, playType }));
  }, [dispatch]);

  const handleSetResult = useCallback((id: string, result: string | undefined) => {
    dispatch(setResult({ id, result }));
  }, [dispatch]);

  const handleSetPlayer = useCallback((id: string, player: string | undefined) => {
    dispatch(setPlayer({ id, player }));
  }, [dispatch]);

  const handleSetTags = useCallback((id: string, tags: string[]) => {
    dispatch(setTags({ id, tags }));
  }, [dispatch]);

  const handleExportCsv = useCallback(() => {
    downloadFile(segmentsToCsv(segments), 'segments.csv', 'text/csv');
  }, [segments]);

  const handleExportJson = useCallback(() => {
    downloadFile(segmentsToJson(segments), 'segments.json', 'application/json');
  }, [segments]);

  const handleExportZip = useCallback(() => {
    if (videoFileRef.current) {
      exportZip(videoFileRef.current, segments);
    }
  }, [exportZip, segments, videoFileRef]);

  return (
    <SegmentPanel
      videoType={videoType}
      segments={segments}
      readOnly={mode === 'cut'}
      classifierMode={mode === 'tag'}
      activeSegment={classifierSegment}
      activeSegmentId={activeSegmentId}
      isExportingZip={isExporting}
      exportZipProgress={exportProgress}
      exportError={exportError}
      onDelete={handleDelete}
      onSetSide={handleSetSide}
      onSetDown={handleSetDown}
      onSetPlayType={handleSetPlayType}
      onSetResult={handleSetResult}
      onSetPlayer={handleSetPlayer}
      onSetTags={handleSetTags}
      onSegmentClick={handleSegmentClick}
      onExportCsv={handleExportCsv}
      onExportJson={handleExportJson}
      onExportZip={handleExportZip}
    />
  );
}
