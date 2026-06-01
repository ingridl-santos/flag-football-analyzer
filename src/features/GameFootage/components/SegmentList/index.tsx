import DeleteIcon from '@mui/icons-material/Delete';
import { Chip, IconButton, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import MultilineSkelly from '../../../../components/MultilineSkelly';
import { type Segment } from '../../../../redux/SegmentSlice';
import { formatTime } from '../../../../utils/formatTime';
import PlayTypeSelector from '../PlayTypeSelector';
import TagSuggestions from '../TagSuggestions';

export interface SegmentListProps {
  segments: Segment[];
  onDelete: (id: string) => void;
  onSetPlayType: (id: string, playType: string) => void;
  onSetTags?: (id: string, tags: string[]) => void;
}

function SegmentRow({
  segment,
  index,
  onDelete,
  onSetPlayType,
  onSetTags,
}: {
  segment: Segment;
  index: number;
  onDelete: (id: string) => void;
  onSetPlayType: (id: string, playType: string) => void;
  onSetTags?: (id: string, tags: string[]) => void;
}) {
  const { t } = useTranslation('gameFootage');

  const timeRange = `${formatTime(segment.start)} → ${formatTime(segment.end)}`;
  const duration = `(${formatTime(segment.duration)})`;

  return (
    <Paper
      variant="outlined"
      sx={{ padding: '1rem' }}
    >
      <Stack sx={{ gap: '0.5rem' }}>
        <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
            {t('segmentLabel', { number: index + 1 }) ?? <Skeleton width="5rem" />}
          </Typography>

          <IconButton
            size="small"
            aria-label={t('deleteSegment') ?? 'Delete segment'}
            onClick={() => onDelete(segment.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack sx={{ flexDirection: 'row', alignItems: 'baseline', gap: '0.5rem' }}>
          <Typography variant="body2">
            {timeRange}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {duration}
          </Typography>
        </Stack>

        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <PlayTypeSelector
            segmentId={segment.id}
            value={segment.playType ?? ''}
            onChange={onSetPlayType}
          />

          {(segment.tags ?? []).map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
            />
          ))}
        </Stack>

        {onSetTags && (
          <TagSuggestions
            playType={segment.playType ?? ''}
            duration={segment.duration}
            existingTags={segment.tags ?? []}
            onAddTag={(tag) => onSetTags(segment.id, [...(segment.tags ?? []), tag])}
          />
        )}
      </Stack>
    </Paper>
  );
}

export default function SegmentList({ segments, onDelete, onSetPlayType, onSetTags }: SegmentListProps) {
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
              {segments.map((segment, index) => (
                <SegmentRow
                  key={segment.id}
                  segment={segment}
                  index={index}
                  onDelete={onDelete}
                  onSetPlayType={onSetPlayType}
                  onSetTags={onSetTags}
                />
              ))}
            </Stack>
          )}
    </Stack>
  );
}
