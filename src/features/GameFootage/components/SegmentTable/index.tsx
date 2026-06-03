import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  ButtonBase,
  Chip,
  IconButton,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '../../../../components/Dialog';
import { type Segment } from '../../../../redux/SegmentSlice';
import { formatTime } from '../../../../utils/formatTime';

export interface SegmentTableProps {
  segments: Segment[];
  hideTitle?: boolean;
  readOnly?: boolean;
  activeSegmentId?: string | null;
  onDelete?: (id: string) => void;
  onSegmentClick?: (id: string) => void;
}

const SKELETON_ROWS = 3;

function SkeletonRow({ index, readOnly }: { index: number; readOnly?: boolean }) {
  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>

      <TableCell>
        <Stack>
          <Skeleton width="7rem" />

          <Skeleton width="3rem" />
        </Stack>
      </TableCell>

      <TableCell>
        <Stack sx={{ flexDirection: 'row', gap: '0.5rem' }}>
          <Skeleton variant="rounded" width="5rem" height="1.5rem" />

          <Skeleton variant="rounded" width="3rem" height="1.5rem" />
        </Stack>
      </TableCell>

      {!readOnly && <TableCell />}
    </TableRow>
  );
}

interface SegmentRowProps {
  segment: Segment;
  index: number;
  readOnly?: boolean;
  isActive: boolean;
  onSegmentClick?: (id: string) => void;
  onDeleteRequest: (id: string) => void;
  rowRefRegistry: Record<string, HTMLTableRowElement | null>;
}

const SegmentRow = memo(function SegmentRow({
  segment,
  index,
  readOnly,
  isActive,
  onSegmentClick,
  onDeleteRequest,
  rowRefRegistry,
}: SegmentRowProps) {
  const { t } = useTranslation('gameFootage');

  const handleRef = useCallback((el: HTMLTableRowElement | null) => {
    rowRefRegistry[segment.id] = el;
  }, [rowRefRegistry, segment.id]);

  const handleSegmentClick = useCallback(() => {
    onSegmentClick?.(segment.id);
  }, [onSegmentClick, segment.id]);

  const handleDeleteRequest = useCallback(() => {
    onDeleteRequest(segment.id);
  }, [onDeleteRequest, segment.id]);

  const segLabel = t('segmentLabel', { number: index + 1 });
  const timeRange = `${formatTime(segment.start)} \u2192 ${formatTime(segment.end)}`;
  const seekHint = t('timelineSeekTo');
  const seekAriaLabel = `${segLabel}: ${timeRange}. ${seekHint}`;

  // Compute human-readable labels from structured fields
  const sideLabel
    = segment.side === 'offense'
      ? t('classifier.offense')
      : segment.side === 'defense'
        ? t('classifier.defense')
        : null;

  const downLabel = (segment.side === 'offense' && segment.down)
    ? t(`classifier.down${segment.down}`)
    : null;

  const playTypeLabel
    = segment.side === 'offense' && segment.playType === 'Run'
      ? t('classifier.run')
      : segment.side === 'offense' && segment.playType === 'Pass'
        ? t('classifier.pass')
        : null;

  const tags = segment.tags ?? [];
  const hasAnyClassification = sideLabel || segment.result || segment.player || tags.length > 0;

  return (
    <TableRow
      ref={handleRef}
      sx={{
        backgroundColor: isActive
          ? (theme) => alpha(theme.palette.primary.main, 0.12)
          : undefined,
        transition: 'background-color 200ms ease',
        '& .MuiTableCell-root': {
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem',
        },
      }}
    >
      <TableCell>
        <Typography variant="body2">{index + 1}</Typography>
      </TableCell>

      <TableCell>
        {onSegmentClick
          ? (
              <ButtonBase
                onClick={handleSegmentClick}
                aria-label={seekAriaLabel}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  borderRadius: '0.25rem',
                  padding: '0.25rem',
                  marginLeft: '-0.25rem',
                  '&:focus-visible': {
                    outline: (theme) =>
                      `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: '2px',
                  },
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                  {timeRange}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {formatTime(segment.duration)}
                </Typography>
              </ButtonBase>
            )
          : (
              <>
                <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                  {timeRange}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {formatTime(segment.duration)}
                </Typography>
              </>
            )}
      </TableCell>

      {/* Classification summary */}
      <TableCell>
        {hasAnyClassification
          ? (
              <Stack sx={{ flexDirection: 'row', flexWrap: 'wrap', gap: '0.25rem', alignItems: 'center' }}>
                {sideLabel && (
                  <Chip
                    label={sideLabel}
                    size="small"
                    color={segment.side === 'offense' ? 'primary' : 'secondary'}
                  />
                )}

                {downLabel && (
                  <Chip label={downLabel} size="small" variant="outlined" />
                )}

                {playTypeLabel && (
                  <Chip label={playTypeLabel} size="small" variant="outlined" />
                )}

                {segment.result && (
                  <Chip label={segment.result} size="small" variant="outlined" />
                )}

                {segment.player && (
                  <Chip label={segment.player} size="small" variant="outlined" />
                )}

                {tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Stack>
            )
          : (
              <Typography variant="body2" color="text.disabled">
                {t('classificationEmpty')}
              </Typography>
            )}
      </TableCell>

      {!readOnly && (
        <TableCell>
          <IconButton
            size="small"
            aria-label={t('deleteSegment')}
            onClick={handleDeleteRequest}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  );
});

export default function SegmentTable({
  segments,
  hideTitle,
  readOnly,
  activeSegmentId,
  onDelete,
  onSegmentClick,
}: SegmentTableProps) {
  const { t } = useTranslation('gameFootage');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  useEffect(() => {
    if (activeSegmentId) {
      rowRefs.current[activeSegmentId]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeSegmentId]);

  const handleDeleteClick = useCallback((id: string) => {
    setPendingDeleteId(id);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (pendingDeleteId) onDelete?.(pendingDeleteId);
    setPendingDeleteId(null);
  }, [onDelete, pendingDeleteId]);

  const handleCancelDelete = useCallback(() => setPendingDeleteId(null), []);

  return (
    <Stack sx={{ gap: '1rem' }}>
      {!hideTitle && (
        <Typography variant="h3" component="h2">
          {t('segments') ?? <Skeleton sx={{ maxWidth: '6rem' }} />}
        </Typography>
      )}

      <TableContainer>
        <Table aria-label={t('segments')}>
          <TableHead>
            <TableRow
              sx={{
                '& .MuiTableCell-root': {
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: (theme) => theme.palette.text.secondary,
                  backgroundColor: (theme) => theme.palette.grey[50],
                  borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                },
              }}
            >
              <TableCell sx={{ width: '2.5rem' }}>
                {t('colNumber') ?? <Skeleton width="1rem" />}
              </TableCell>

              <TableCell sx={{ width: '9rem' }}>
                {t('colTimeRange') ?? <Skeleton width="5rem" />}
              </TableCell>

              <TableCell>
                {t('colClassification') ?? <Skeleton width="6rem" />}
              </TableCell>

              {!readOnly && <TableCell sx={{ width: '3rem' }} />}
            </TableRow>
          </TableHead>

          <TableBody>
            {segments.length === 0
              ? Array.from({ length: SKELETON_ROWS }, (_, i) => (
                  <SkeletonRow key={i} index={i} readOnly={readOnly} />
                ))
              : segments.map((segment, index) => (
                  <SegmentRow
                    key={segment.id}
                    segment={segment}
                    index={index}
                    readOnly={readOnly}
                    isActive={segment.id === activeSegmentId}
                    onSegmentClick={onSegmentClick}
                    onDeleteRequest={handleDeleteClick}
                    rowRefRegistry={rowRefs.current}
                  />
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {segments.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ paddingLeft: '0.25rem' }}>
          {t('noSegments') ?? <Skeleton sx={{ maxWidth: '10rem' }} />}
        </Typography>
      )}

      <Dialog
        open={pendingDeleteId !== null}
        title={t('deleteConfirmTitle') ?? <Skeleton width="9rem" />}
        closeButtonTextLabel={t('close', { ns: 'common', defaultValue: 'Close' })}
        content={(
          <Typography variant="body2">
            {t('deleteConfirmMessage') ?? <Skeleton width="13rem" />}
          </Typography>
        )}
        actions={(
          <>
            <Button variant="outlined" onClick={handleCancelDelete}>
              {t('deleteConfirmCancel') ?? <Skeleton width="4rem" />}
            </Button>

            <Button variant="contained" color="error" onClick={handleConfirmDelete}>
              {t('deleteConfirmAction') ?? <Skeleton width="4rem" />}
            </Button>
          </>
        )}
        onClose={handleCancelDelete}
      />
    </Stack>
  );
}
