import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

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
  const { videoType, currentTime, isPlaying } = useAppSelector(selectVideoState);
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

  const classifierIndex = classifierSegmentId
    ? segments.findIndex((s) => s.id === classifierSegmentId)
    : -1;
  const hasPrev = classifierIndex > 0;
  const hasNext = classifierIndex >= 0 && classifierIndex < segments.length - 1;

  // Navigate to a specific segment: seek to its start and pause so the coach
  // can review and tag before pressing play.
  const handleNavigateToSegment = useCallback((id: string) => {
    const segment = segments.find((s) => s.id === id);

    if (!segment) return;

    dispatch(requestSeek(segment.start));
    dispatch(setCurrentTime(segment.start));
    dispatch(setIsPlaying(false));
    setClassifierSegmentId(id);
    videoPlayerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [dispatch, segments, videoPlayerRef]);

  const handleNavigatePrev = useCallback(() => {
    if (classifierIndex > 0) handleNavigateToSegment(segments[classifierIndex - 1].id);
  }, [classifierIndex, handleNavigateToSegment, segments]);

  const handleNavigateNext = useCallback(() => {
    if (classifierIndex >= 0 && classifierIndex < segments.length - 1) {
      handleNavigateToSegment(segments[classifierIndex + 1].id);
    }
  }, [classifierIndex, handleNavigateToSegment, segments]);

  // When switching into tag mode, auto-select the segment currently under the
  // playhead (if any) or the first segment, so the classifier is never blank.
  // Refs keep the latest values accessible inside the effect without making
  // mode-changes re-run on every segment/time update.
  const segmentsRef = useRef(segments);
  segmentsRef.current = segments;
  const activeSegmentIdRef = useRef(activeSegmentId);
  activeSegmentIdRef.current = activeSegmentId;
  const handleNavigateToSegmentRef = useRef(handleNavigateToSegment);
  handleNavigateToSegmentRef.current = handleNavigateToSegment;

  const prevModeRef = useRef(mode);
  useEffect(() => {
    const wasTag = prevModeRef.current === 'tag';
    prevModeRef.current = mode;

    if (mode !== 'tag' || wasTag) return;
    if (segmentsRef.current.length === 0) return;

    const target
      = segmentsRef.current.find((s) => s.id === activeSegmentIdRef.current)
        ?? segmentsRef.current[0];
    handleNavigateToSegmentRef.current(target.id);
  }, [mode]);

  // Clamp playback to the classifier segment's boundaries in tag mode: stop and
  // loop back to the segment start when the playhead reaches (or passes) its end.
  useEffect(() => {
    if (mode !== 'tag' || !classifierSegment || !isPlaying) return;
    if (currentTime >= classifierSegment.end) {
      dispatch(setIsPlaying(false));
      dispatch(requestSeek(classifierSegment.start));
      dispatch(setCurrentTime(classifierSegment.start));
    }
  }, [currentTime, mode, classifierSegment, isPlaying, dispatch]);

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
      hasPrev={hasPrev}
      hasNext={hasNext}
      onNavigatePrev={handleNavigatePrev}
      onNavigateNext={handleNavigateNext}
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
