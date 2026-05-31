import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useDocumentTitle from '../../../hooks/useDocumentTitle';
import { clearBreadcrumbs, setBreadcrumbs } from '../../../redux/BreadcrumbSlice';
import { useAppDispatch } from '../../../redux/hooks';
import SegmentControlsHoc from '../hocs/SegmentControlsHoc';
import SegmentPanelHoc from '../hocs/SegmentPanelHoc';
import VideoPlayerHoc from '../hocs/VideoPlayerHoc';
import GameFootageTemplate from '../templates/GameFootageTemplate';

export default function GameFootagePage() {
  const { t } = useTranslation('pageTitles');
  const { t: tCommon } = useTranslation('common');
  const { t: tGameFootage } = useTranslation('gameFootage');
  const dispatch = useAppDispatch();
  const videoFileRef = useRef<File | null>(null);
  const [showSegmentCreatedToast, setShowSegmentCreatedToast] = useState(false);

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

  const handleCloseToast = useCallback(() => setShowSegmentCreatedToast(false), []);

  const handleSegmentCreated = useCallback(() => setShowSegmentCreatedToast(true), []);

  return (
    <GameFootageTemplate
      VideoPlayerHoc={<VideoPlayerHoc videoFileRef={videoFileRef} />}
      SegmentControlsHoc={(
        <SegmentControlsHoc onSegmentCreated={handleSegmentCreated} />
      )}
      SegmentPanelHoc={<SegmentPanelHoc videoFileRef={videoFileRef} />}
      showSegmentCreatedToast={showSegmentCreatedToast}
      onCloseToast={handleCloseToast}
    />
  );
}
