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
  const { exportZip, isExporting, exportProgress } = useVideoExport();

  const activeSegmentId = useActiveSegmentId(segments, currentTime);

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
