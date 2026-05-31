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
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '../../../../components/Dialog';
import { type Segment } from '../../../../redux/SegmentSlice';
import { formatTime } from '../../../../utils/formatTime';
import PlayTypeSelector from '../PlayTypeSelector';
import TagSuggestions from '../TagSuggestions';

export interface SegmentTableProps {
  segments: Segment[];
  hideTitle?: boolean;
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

export default function SegmentTable({
  segments,
  hideTitle,
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
            <TableRow>
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

              <TableCell sx={{ width: '3rem' }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {segments.length === 0
              ? Array.from({ length: SKELETON_ROWS }, (_, i) => (
                  <SkeletonRow key={i} index={i} />
                ))
              : segments.map((segment, index) => {
                  const segLabel = t('segmentLabel', { number: index + 1 });
                  const timeRange = `${formatTime(segment.start)} → ${formatTime(segment.end)}`;
                  const seekHint = t('timelineSeekTo');
                  const seekAriaLabel = `${segLabel}: ${timeRange}. ${seekHint}`;

                  return (
                    <TableRow
                      key={segment.id}
                      ref={(el) => { rowRefs.current[segment.id] = el; }}
                      sx={{
                        backgroundColor: segment.id === activeSegmentId
                          ? (theme) => alpha(theme.palette.primary.main, 0.1)
                          : undefined,
                        transition: 'background-color 200ms ease',
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
                        <PlayTypeSelector
                          segmentId={segment.id}
                          value={segment.playType ?? ''}
                          onChange={onSetPlayType ?? (() => {})}
                        />
                      </TableCell>

                      <TableCell>
                        <Autocomplete
                          multiple
                          freeSolo
                          options={[]}
                          value={segment.tags ?? []}
                          onChange={(_, newValue) => onSetTags?.(segment.id, newValue as string[])}
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
                                'aria-label': t('colTags'),
                              }}
                            />
                          )}
                        />

                        <TagSuggestions
                          playType={segment.playType ?? ''}
                          duration={segment.duration}
                          existingTags={segment.tags ?? []}
                          onAddTag={(tag) => onSetTags?.(segment.id, [...(segment.tags ?? []), tag])}
                        />
                      </TableCell>

                      <TableCell>
                        <IconButton
                          size="small"
                          aria-label={t('deleteSegment')}
                          onClick={() => handleDeleteClick(segment.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
