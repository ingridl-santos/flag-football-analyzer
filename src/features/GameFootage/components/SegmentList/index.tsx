import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import MultilineSkelly from '../../../../components/MultilineSkelly';
import { type Segment } from '../../../../redux/SegmentSlice';
import { formatTime } from '../../../../utils/formatTime';

export interface SegmentListProps {
  segments: Segment[];
  onDelete: (id: string) => void;
}

function SegmentRow({ segment, onDelete }: { segment: Segment; onDelete: (id: string) => void }) {
  const { t } = useTranslation('gameFootage');

  return (
    <Paper
      variant="outlined"
      sx={{ padding: '0.75rem 1rem' }}
    >
      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
        <Stack sx={{ flexDirection: 'row', gap: '1.5rem', flexGrow: 1 }}>
          <Stack>
            <Typography variant="caption" color="text.secondary">
              {t('segmentStart') ?? <Skeleton width="2.5rem" />}
            </Typography>

            <Typography variant="body2" fontWeight="medium">
              {formatTime(segment.start)}
            </Typography>
          </Stack>

          <Stack>
            <Typography variant="caption" color="text.secondary">
              {t('segmentEnd') ?? <Skeleton width="2rem" />}
            </Typography>

            <Typography variant="body2" fontWeight="medium">
              {formatTime(segment.end)}
            </Typography>
          </Stack>

          <Stack>
            <Typography variant="caption" color="text.secondary">
              {t('segmentDuration') ?? <Skeleton width="3.5rem" />}
            </Typography>

            <Typography variant="body2" fontWeight="medium">
              {formatTime(segment.duration)}
            </Typography>
          </Stack>
        </Stack>

        <IconButton
          size="small"
          aria-label={t('deleteSegment') ?? 'Delete segment'}
          onClick={() => onDelete(segment.id)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Paper>
  );
}

export default function SegmentList({ segments, onDelete }: SegmentListProps) {
  const { t } = useTranslation('gameFootage');

  return (
    <Stack sx={{ gap: '1rem' }}>
      <Typography variant="h3" component="h2">
        {t('segments') ?? <Skeleton sx={{ maxWidth: '6rem' }} />}
      </Typography>

      {segments.length === 0
        ? (
            <Typography variant="body2" color="text.secondary">
              {t('noSegments') ?? <MultilineSkelly lines={1} lastLineWidth="10rem" />}
            </Typography>
          )
        : (
            <Stack sx={{ gap: '0.5rem' }}>
              {segments.map((segment) => (
                <SegmentRow key={segment.id} segment={segment} onDelete={onDelete} />
              ))}
            </Stack>
          )}
    </Stack>
  );
}
