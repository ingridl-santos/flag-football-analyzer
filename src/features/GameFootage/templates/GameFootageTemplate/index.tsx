import { ReactNode } from 'react';

import { Alert, Skeleton, Snackbar, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export interface GameFootageTemplateProps {
  VideoPlayerHoc: ReactNode;
  SegmentControlsHoc: ReactNode;
  SegmentPanelHoc: ReactNode;
  showSegmentCreatedToast: boolean;
  onCloseToast?: () => void;
}

export default function GameFootageTemplate({
  VideoPlayerHoc,
  SegmentControlsHoc,
  SegmentPanelHoc,
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

        {VideoPlayerHoc}

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
