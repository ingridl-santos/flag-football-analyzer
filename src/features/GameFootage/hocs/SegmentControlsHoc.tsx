import { useCallback } from 'react';

import { selectAnalysisState } from '../../../redux/AnalysisSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  createSegment,
  selectSegmentState,
  setPendingEnd,
  setPendingStart,
} from '../../../redux/SegmentSlice';
import { selectVideoState, setIsPlaying } from '../../../redux/VideoSlice';
import SegmentControls from '../components/SegmentControls';

export interface SegmentControlsHocProps {
  onSegmentCreated: () => void;
}

export default function SegmentControlsHoc({ onSegmentCreated }: SegmentControlsHocProps) {
  const dispatch = useAppDispatch();
  const { currentTime, videoType } = useAppSelector(selectVideoState);
  const { mode } = useAppSelector(selectAnalysisState);
  const {
    pendingStart,
    pendingEnd,
  } = useAppSelector(selectSegmentState);

  const handleSetStart = useCallback(() => {
    dispatch(setPendingStart(currentTime));
  }, [dispatch, currentTime]);

  const handleSetEnd = useCallback(() => {
    dispatch(setPendingEnd(currentTime));
    dispatch(setIsPlaying(false));
  }, [dispatch, currentTime]);

  const handleCreateSegment = useCallback(() => {
    if (pendingStart === null || pendingEnd === null || pendingStart >= pendingEnd) return;

    dispatch(createSegment());
    onSegmentCreated();
  }, [dispatch, onSegmentCreated, pendingStart, pendingEnd]);

  return (
    <SegmentControls
      videoLoaded={videoType !== null}
      mode={mode}
      pendingStart={pendingStart}
      pendingEnd={pendingEnd}
      onSetStart={handleSetStart}
      onSetEnd={handleSetEnd}
      onCreateSegment={handleCreateSegment}
    />
  );
}
