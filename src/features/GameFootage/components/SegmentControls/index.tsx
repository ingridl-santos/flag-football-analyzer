import { Button, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { AnalysisMode } from '../../../../redux/AnalysisSlice';
import { formatTime } from '../../../../utils/formatTime';

export interface SegmentControlsProps {
  videoLoaded: boolean;
  mode: AnalysisMode;
  pendingStart: number | null;
  pendingEnd: number | null;
  onSetStart?: () => void;
  onSetEnd?: () => void;
  onCreateSegment?: () => void;
}

export default function SegmentControls({
  videoLoaded,
  mode,
  pendingStart,
  pendingEnd,
  onSetStart,
  onSetEnd,
  onCreateSegment,
}: SegmentControlsProps) {
  const { t } = useTranslation('gameFootage');

  if (!videoLoaded || mode === 'tag') return null;

  const canCreateSegment = pendingStart !== null && pendingEnd !== null && pendingStart < pendingEnd;

  return (
    <Stack sx={{ gap: '1rem' }}>
      <Card>
        <CardContent>
          <Stack sx={{ flexDirection: 'row', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="outlined" onClick={onSetStart}>
              {t('setStart') ?? <Skeleton width="5rem" />}

              {pendingStart !== null && (
                <Typography variant="caption" sx={{ marginLeft: '0.5rem' }}>
                  {formatTime(pendingStart)}
                </Typography>
              )}
            </Button>

            <Button variant="outlined" onClick={onSetEnd}>
              {t('setEnd') ?? <Skeleton width="4.5rem" />}

              {pendingEnd !== null && (
                <Typography variant="caption" sx={{ marginLeft: '0.5rem' }}>
                  {formatTime(pendingEnd)}
                </Typography>
              )}
            </Button>

            <Button
              variant="contained"
              onClick={onCreateSegment}
              disabled={!canCreateSegment}
            >
              {t('createSegment') ?? <Skeleton width="8rem" />}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
