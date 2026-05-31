import { MutableRefObject, useCallback } from 'react';

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
  const { videoType } = useAppSelector(selectVideoState);
  const { segments } = useAppSelector(selectSegmentState);
  const currentTime = useAppSelector(selectVideoState).currentTime;
  const { exportZip, isExporting, exportProgress } = useVideoExport();

  const activeSegmentId = segments.find(
    (s) => currentTime >= s.start && currentTime <= s.end,
  )?.id ?? null;

  const handleSegmentClick = useCallback((id: string) => {
    const segment = segments.find((s) => s.id === id);

    if (segment) dispatch(setCurrentTime(segment.start));
  }, [dispatch, segments]);

  return (
    <SegmentPanel
      videoType={videoType}
      segments={segments}
      activeSegmentId={activeSegmentId}
      isExportingZip={isExporting}
      exportZipProgress={exportProgress}
      onDelete={(id) => dispatch(deleteSegment(id))}
      onSetPlayType={(id, pt) => dispatch(setPlayType({ id, playType: pt }))}
      onSetTags={(id, tags) => dispatch(setTags({ id, tags }))}
      onSegmentClick={handleSegmentClick}
      onExportCsv={() => downloadFile(segmentsToCsv(segments), 'segments.csv', 'text/csv')}
      onExportJson={() => downloadFile(segmentsToJson(segments), 'segments.json', 'application/json')}
      onExportZip={() => {
        if (videoFileRef.current) {
          exportZip(videoFileRef.current, segments);
        }
      }}
    />
  );
}
