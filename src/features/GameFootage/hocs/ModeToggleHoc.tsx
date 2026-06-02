import { useCallback } from 'react';

import { selectAnalysisState, setAnalysisMode, type AnalysisMode } from '../../../redux/AnalysisSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectVideoState } from '../../../redux/VideoSlice';
import ModeToggle from '../components/ModeToggle';

export default function ModeToggleHoc() {
  const dispatch = useAppDispatch();
  const { videoType } = useAppSelector(selectVideoState);
  const { mode } = useAppSelector(selectAnalysisState);

  const handleModeChange = useCallback((newMode: AnalysisMode) => {
    dispatch(setAnalysisMode(newMode));
  }, [dispatch]);

  return (
    <ModeToggle
      videoLoaded={videoType !== null}
      mode={mode}
      onModeChange={handleModeChange}
    />
  );
}
