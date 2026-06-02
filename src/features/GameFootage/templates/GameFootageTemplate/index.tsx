import { ReactNode, RefObject } from 'react';

import { Alert, Box, Skeleton, Snackbar, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export interface GameFootageTemplateProps {
  VideoPlayerHoc: ReactNode;
  ModeToggleHoc: ReactNode;
  SegmentControlsHoc: ReactNode;
  SegmentPanelHoc: ReactNode;
  videoPlayerRef?: RefObject<HTMLDivElement>;
  showSegmentCreatedToast: boolean;
  onCloseToast?: () => void;
}

export default function GameFootageTemplate({
  VideoPlayerHoc,
  ModeToggleHoc,
  SegmentControlsHoc,
  SegmentPanelHoc,
  videoPlayerRef,
  showSegmentCreatedToast,
  onCloseToast,
}: GameFootageTemplateProps) {
  const { t } = useTranslation('gameFootage');

  return (
    <Stack sx={{ gap: '2rem' }}>
      <Stack sx={{ gap: '2rem', maxWidth: '56rem', marginX: 'auto', width: '100%' }}>
        <Typography variant="h2" component="h1">
          {t('title') ?? <Skeleton sx={{ maxWidth: '12rem' }} />}
        </Typography>

        <Box ref={videoPlayerRef}>
          {VideoPlayerHoc}
        </Box>

        {ModeToggleHoc}

        {SegmentControlsHoc}

        {SegmentPanelHoc}
      </Stack>

      <Snackbar
        open={showSegmentCreatedToast}
        autoHideDuration={3000}
        onClose={onCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          onClose={onCloseToast}
          sx={{ width: '100%' }}
        >
          {t('segmentCreated')}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
