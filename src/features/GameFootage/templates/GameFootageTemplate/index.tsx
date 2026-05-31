import { ReactNode } from 'react';

import { Alert, Grid, Snackbar, Stack } from '@mui/material';
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
      <Grid container spacing="0.5rem" sx={{ alignItems: 'flex-start' }}>
        <Grid item xs={12} lg={6}>
          <Stack sx={{ gap: '1rem' }}>
            {VideoPlayerHoc}

            {SegmentControlsHoc}
          </Stack>
        </Grid>

        <Grid item xs={12} lg={6}>
          {SegmentPanelHoc}
        </Grid>
      </Grid>

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
