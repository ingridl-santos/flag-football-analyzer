import { MutableRefObject, useCallback } from 'react';

import { useActiveSegmentId } from '../../../hooks/useActiveSegmentId';
import { useVideoExport } from '../../../hooks/useVideoExport';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  deleteSegment,
  selectSegmentState,
  setPlayType,
  setTags,
} from '../../../redux/SegmentSlice';
import { selectVideoState, setCurrentTime } from '../../../redux/VideoSlice';
import { downloadFile, segmentsToCsv, segmentsToJson } from '../../../utils/exportSegments';
import SegmentPanel from '../components/SegmentPanel';

export interface SegmentPanelHocProps {
  videoFileRef: MutableRefObject<File | null>;
}

export default function SegmentPanelHoc({ videoFileRef }: SegmentPanelHocProps) {
  const dispatch = useAppDispatch();
  const { videoType, currentTime } = useAppSelector(selectVideoState);
  const { segments } = useAppSelector(selectSegmentState);
  const { exportZip, isExporting, exportProgress, exportError } = useVideoExport();

  const activeSegmentId = useActiveSegmentId(segments, currentTime);

  const handleSegmentClick = useCallback((id: string) => {
    const segment = segments.find((s) => s.id === id);

    if (segment) dispatch(setCurrentTime(segment.start));
  }, [dispatch, segments]);

  const handleDelete = useCallback((id: string) => {
    dispatch(deleteSegment(id));
  }, [dispatch]);

  const handleSetPlayType = useCallback((id: string, pt: string) => {
    dispatch(setPlayType({ id, playType: pt }));
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
      activeSegmentId={activeSegmentId}
      isExportingZip={isExporting}
      exportZipProgress={exportProgress}
      exportError={exportError}
      onDelete={handleDelete}
      onSetPlayType={handleSetPlayType}
      onSetTags={handleSetTags}
      onSegmentClick={handleSegmentClick}
      onExportCsv={handleExportCsv}
      onExportJson={handleExportJson}
      onExportZip={handleExportZip}
    />
  );
}
