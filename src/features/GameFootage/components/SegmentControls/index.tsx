import { Button, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { formatTime } from '../../../../utils/formatTime';
import PlayTypeSelector from '../PlayTypeSelector';
import TagSuggestions from '../TagSuggestions';

export interface SegmentControlsProps {
  videoLoaded: boolean;
  pendingStart: number | null;
  pendingEnd: number | null;
  pendingPlayType: string;
  pendingTags: string[];
  onSetStart?: () => void;
  onSetEnd?: () => void;
  onSetPendingPlayType?: (playType: string) => void;
  onSetPendingTags?: (tags: string[]) => void;
  onCreateSegment?: () => void;
}

export default function SegmentControls({
  videoLoaded,
  pendingStart,
  pendingEnd,
  pendingPlayType,
  pendingTags,
  onSetStart,
  onSetEnd,
  onSetPendingPlayType,
  onSetPendingTags,
  onCreateSegment,
}: SegmentControlsProps) {
  const { t } = useTranslation('gameFootage');

  if (!videoLoaded) return null;

  const canCreateSegment = pendingStart !== null && pendingEnd !== null && pendingStart < pendingEnd;

  return (
    <Stack sx={{ gap: '1rem' }}>
      <Card>
        <CardContent>
          <Stack sx={{ flexDirection: 'row', gap: '0.75rem', flexWrap: 'wrap' }}>
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

      {canCreateSegment && (
        <Card>
          <CardContent>
            <Stack sx={{ gap: '0.75rem' }}>
              <Typography variant="caption" color="text.secondary">
                {t('pendingSegmentSetup') ?? <Skeleton width="10rem" />}
              </Typography>

              <PlayTypeSelector
                segmentId="pending"
                value={pendingPlayType}
                onChange={(_, playType) => onSetPendingPlayType?.(playType)}
              />

              <TagSuggestions
                playType={pendingPlayType}
                duration={(pendingEnd ?? 0) - (pendingStart ?? 0)}
                existingTags={pendingTags}
                onAddTag={(tag) => onSetPendingTags?.([...pendingTags, tag])}
              />
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
