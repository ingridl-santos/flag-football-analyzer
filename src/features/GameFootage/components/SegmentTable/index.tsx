import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Autocomplete,
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
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '../../../../components/Dialog';
import { type Segment } from '../../../../redux/SegmentSlice';
import { formatTime } from '../../../../utils/formatTime';
import { suggestTags } from '../../../../utils/suggestTags';
import PlayTypeSelector from '../PlayTypeSelector';

export interface SegmentTableProps {
  segments: Segment[];
  hideTitle?: boolean;
  readOnly?: boolean;
  activeSegmentId?: string | null;
  onDelete?: (id: string) => void;
  onSetPlayType?: (id: string, playType: string) => void;
  onSetTags?: (id: string, tags: string[]) => void;
  onSegmentClick?: (id: string) => void;
}

const SKELETON_ROWS = 3;

function SkeletonRow({ index }: { index: number }) {
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
        <Skeleton width="6rem" />
      </TableCell>

      <TableCell>
        <Skeleton width="8rem" />
      </TableCell>

      <TableCell />
    </TableRow>
  );
}

interface SegmentRowProps {
  segment: Segment;
  index: number;
  readOnly?: boolean;
  activeSegmentId?: string | null;
  onSetPlayType?: (id: string, playType: string) => void;
  onSetTags?: (id: string, tags: string[]) => void;
  onSegmentClick?: (id: string) => void;
  onDeleteRequest: (id: string) => void;
  rowRef: (el: HTMLTableRowElement | null) => void;
}

function SegmentRow({
  segment,
  index,
  readOnly,
  activeSegmentId,
  onSetPlayType,
  onSetTags,
  onSegmentClick,
  onDeleteRequest,
  rowRef,
}: SegmentRowProps) {
  const { t } = useTranslation('gameFootage');

  const { options, autoSet } = useMemo(() => {
    const { auto, more } = suggestTags(segment.playType ?? '', segment.duration);
    const set = new Set(auto);
    const opts = [
      ...auto,
      ...more.filter((tag) => !auto.includes(tag)),
    ].filter((opt) => !(segment.tags ?? []).includes(opt));
    return { options: opts, autoSet: set };
  }, [segment.playType, segment.duration, segment.tags]);

  const tags = segment.tags ?? [];
  const segLabel = t('segmentLabel', { number: index + 1 });
  const timeRange = `${formatTime(segment.start)} \u2192 ${formatTime(segment.end)}`;
  const seekHint = t('timelineSeekTo');
  const seekAriaLabel = `${segLabel}: ${timeRange}. ${seekHint}`;

  return (
    <TableRow
      ref={rowRef}
      sx={{
        backgroundColor: segment.id === activeSegmentId
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
                onClick={() => onSegmentClick(segment.id)}
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

      <TableCell>
        {readOnly
          ? (
              <Typography variant="body2" color={segment.playType ? 'text.primary' : 'text.disabled'}>
                {segment.playType || t('playTypeNone')}
              </Typography>
            )
          : (
              <PlayTypeSelector
                segmentId={segment.id}
                value={segment.playType ?? ''}
                onChange={onSetPlayType ?? (() => {})}
              />
            )}
      </TableCell>

      <TableCell>
        {readOnly
          ? (
              <Stack sx={{ flexDirection: 'row', flexWrap: 'wrap', gap: '0.25rem' }}>
                {tags.length > 0
                  ? tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))
                  : (
                      <Typography variant="body2" color="text.disabled">
                        —
                      </Typography>
                    )}
              </Stack>
            )
          : (
              <Autocomplete
                multiple
                freeSolo
                options={options}
                value={segment.tags ?? []}
                onChange={(_, newValue) => onSetTags?.(segment.id, newValue as string[])}
                getOptionLabel={(opt) => opt}
                renderOption={(props, opt) => (
                  <li {...props} key={opt}>
                    <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      {autoSet.has(opt) && (
                        <AutoAwesomeIcon
                          fontSize="small"
                          aria-hidden="true"
                          sx={{ color: (theme) => theme.palette.primary.main, fontSize: '0.875rem' }}
                        />
                      )}

                      <span>{opt}</span>
                    </Stack>
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((tag, i) => (
                    <Chip
                      label={tag}
                      size="small"
                      {...getTagProps({ index: i })}
                      key={tag}
                    />
                  ))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    size="small"
                    placeholder={segment.tags?.length
                      ? undefined
                      : t('tagsInputPlaceholder')}
                    inputProps={{
                      ...params.inputProps,
                      'aria-label': t('tagsLabel'),
                    }}
                  />
                )}
              />
            )}
      </TableCell>

      <TableCell>
        {!readOnly && (
          <IconButton
            size="small"
            aria-label={t('deleteSegment')}
            onClick={() => onDeleteRequest(segment.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
}

export default function SegmentTable({
  segments,
  hideTitle,
  readOnly,
  activeSegmentId,
  onDelete,
  onSetPlayType,
  onSetTags,
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

  const handleDeleteClick = (id: string) => setPendingDeleteId(id);

  const handleConfirmDelete = () => {
    if (pendingDeleteId) onDelete?.(pendingDeleteId);
    setPendingDeleteId(null);
  };

  const handleCancelDelete = () => setPendingDeleteId(null);

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

              <TableCell sx={{ width: '10rem' }}>
                {t('colPlayType') ?? <Skeleton width="5rem" />}
              </TableCell>

              <TableCell>
                {t('colTags') ?? <Skeleton width="3rem" />}
              </TableCell>

              {!readOnly && <TableCell sx={{ width: '3rem' }} />}
            </TableRow>
          </TableHead>

          <TableBody>
            {segments.length === 0
              ? Array.from({ length: SKELETON_ROWS }, (_, i) => (
                  <SkeletonRow key={i} index={i} />
                ))
              : segments.map((segment, index) => (
                  <SegmentRow
                    key={segment.id}
                    segment={segment}
                    index={index}
                    readOnly={readOnly}
                    activeSegmentId={activeSegmentId}
                    onSetPlayType={onSetPlayType}
                    onSetTags={onSetTags}
                    onSegmentClick={onSegmentClick}
                    onDeleteRequest={handleDeleteClick}
                    rowRef={(el) => { rowRefs.current[segment.id] = el; }}
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
        closeButtonTextLabel={t('close', { ns: 'common' }) ?? 'Close'}
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
