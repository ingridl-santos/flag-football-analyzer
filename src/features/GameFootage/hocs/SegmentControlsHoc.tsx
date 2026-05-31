import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  createSegment,
  selectSegmentState,
  setPendingEnd,
  setPendingPlayType,
  setPendingStart,
  setPendingTags,
} from '../../../redux/SegmentSlice';
import { selectVideoState } from '../../../redux/VideoSlice';
import SegmentControls from '../components/SegmentControls';

export interface SegmentControlsHocProps {
  onSegmentCreated: () => void;
}

export default function SegmentControlsHoc({ onSegmentCreated }: SegmentControlsHocProps) {
  const dispatch = useAppDispatch();
  const { currentTime, videoType } = useAppSelector(selectVideoState);
  const {
    pendingStart,
    pendingEnd,
    pendingPlayType,
    pendingTags,
  } = useAppSelector(selectSegmentState);

  const handleSetStart = useCallback(() => {
    dispatch(setPendingStart(currentTime));
  }, [dispatch, currentTime]);

  const handleSetEnd = useCallback(() => {
    dispatch(setPendingEnd(currentTime));
  }, [dispatch, currentTime]);

  const handleCreateSegment = useCallback(() => {
    dispatch(createSegment());
    onSegmentCreated();
  }, [dispatch, onSegmentCreated]);

  return (
    <SegmentControls
      videoLoaded={videoType !== null}
      pendingStart={pendingStart}
      pendingEnd={pendingEnd}
      pendingPlayType={pendingPlayType}
      pendingTags={pendingTags}
      onSetStart={handleSetStart}
      onSetEnd={handleSetEnd}
      onSetPendingPlayType={(pt) => dispatch(setPendingPlayType(pt))}
      onSetPendingTags={(tags) => dispatch(setPendingTags(tags))}
      onCreateSegment={handleCreateSegment}
    />
  );
}
