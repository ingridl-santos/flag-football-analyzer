import { Box, ButtonBase, Stack, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { type Segment } from '../../../../redux/SegmentSlice';
import { formatTime } from '../../../../utils/formatTime';

export interface SegmentTimelineProps {
  segments: Segment[];
  duration: number;
  currentTime: number;
  activeSegmentId: string | null;
  onSegmentClick?: (id: string) => void;
}

export default function SegmentTimeline({
  segments,
  duration,
  currentTime,
  activeSegmentId,
  onSegmentClick,
}: SegmentTimelineProps) {
  const { t } = useTranslation('gameFootage');

  if (duration <= 0) return null;

  const playheadPercent = (currentTime / duration) * 100;

  return (
    <Stack sx={{ gap: '0.25rem' }}>
      <Typography variant="caption" color="text.secondary">
        {t('timelineSegmentsLabel')}
      </Typography>

      <Box
        role="list"
        aria-label={t('timelineSegmentsLabel')}
        sx={{
          position: 'relative',
          height: '2rem',
          borderRadius: '0.25rem',
          backgroundColor: (theme) => theme.palette.grey[200],
          overflow: 'visible',
        }}
      >
        {/* Segment bands */}
        {segments.map((segment, index) => {
          const leftPercent = (segment.start / duration) * 100;
          const widthPercent = (segment.duration / duration) * 100;
          const isActive = segment.id === activeSegmentId;
          const timeRange = `${formatTime(segment.start)} → ${formatTime(segment.end)}`;
          const segmentNumber = index + 1;
          const segmentName = t('segmentLabel', { number: segmentNumber });
          const label = `${segmentName}: ${timeRange}`;

          return (
            <Tooltip key={segment.id} title={label} placement="top">
              <ButtonBase
                role="listitem"
                aria-label={`${label}. ${t('timelineSeekTo')}`}
                onClick={() => onSegmentClick?.(segment.id)}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: `${leftPercent}%`,
                  width: `${Math.max(widthPercent, 0.5)}%`,
                  height: '100%',
                  borderRadius: '0.125rem',
                  backgroundColor: isActive
                    ? (theme) => theme.palette.primary.main
                    : (theme) => theme.palette.primary.light,
                  opacity: isActive ? 1 : 0.6,
                  transition: 'opacity 150ms ease, background-color 150ms ease',
                  '&:hover': {
                    opacity: 1,
                  },
                  '&:focus-visible': {
                    outline: (theme) => `2px solid ${theme.palette.primary.dark}`,
                    outlineOffset: '2px',
                  },
                  zIndex: isActive ? 2 : 1,
                }}
              />
            </Tooltip>
          );
        })}

        {/* Playhead */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: '-0.25rem',
            left: `${playheadPercent}%`,
            transform: 'translateX(-50%)',
            width: '2px',
            height: 'calc(100% + 0.5rem)',
            backgroundColor: (theme) => theme.palette.text.primary,
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />
      </Box>
    </Stack>
  );
}
