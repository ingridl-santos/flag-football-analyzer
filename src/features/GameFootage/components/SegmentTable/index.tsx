import DeleteIcon from '@mui/icons-material/Delete';
import {
  Autocomplete,
  Button,
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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '../../../../components/Dialog';
import { type Segment } from '../../../../redux/SegmentSlice';
import { formatTime } from '../../../../utils/formatTime';
import PlayTypeSelector from '../PlayTypeSelector';

export interface SegmentTableProps {
  segments: Segment[];
  onDelete: (id: string) => void;
  onSetPlayType: (id: string, playType: string) => void;
  onSetTags: (id: string, tags: string[]) => void;
}

const SKELETON_ROWS = 3;

function SkeletonRow({ index }: { index: number }) {
  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>

      <TableCell>
        <Skeleton width="7rem" />
      </TableCell>

      <TableCell>
        <Skeleton width="3rem" />
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

export default function SegmentTable({ segments, onDelete, onSetPlayType, onSetTags }: SegmentTableProps) {
  const { t } = useTranslation('gameFootage');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => setPendingDeleteId(id);

  const handleConfirmDelete = () => {
    if (pendingDeleteId) onDelete(pendingDeleteId);
    setPendingDeleteId(null);
  };

  const handleCancelDelete = () => setPendingDeleteId(null);

  return (
    <Stack sx={{ gap: '1rem' }}>
      <Typography variant="h3" component="h2">
        {t('segments') ?? <Skeleton sx={{ maxWidth: '6rem' }} />}
      </Typography>

      <TableContainer>
        <Table size="small" aria-label={t('segments') ?? 'Segments'}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '2.5rem' }}>
                {t('colNumber') ?? <Skeleton width="1rem" />}
              </TableCell>

              <TableCell>
                {t('colTimeRange') ?? <Skeleton width="5rem" />}
              </TableCell>

              <TableCell>
                {t('colDuration') ?? <Skeleton width="4.5rem" />}
              </TableCell>

              <TableCell>
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
              : segments.map((segment, index) => (
                  <TableRow key={segment.id}>
                    <TableCell>
                      <Typography variant="body2">{index + 1}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                        {`${formatTime(segment.start)} → ${formatTime(segment.end)}`}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {formatTime(segment.duration)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <PlayTypeSelector
                        segmentId={segment.id}
                        value={segment.playType ?? ''}
                        onChange={onSetPlayType}
                      />
                    </TableCell>

                    <TableCell sx={{ minWidth: '10rem' }}>
                      <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={segment.tags ?? []}
                        onChange={(_, newValue) => onSetTags(segment.id, newValue as string[])}
                        renderTags={(value, getTagProps) => (
                          value.map((tag, index) => (
                            <Chip
                              label={tag}
                              size="small"
                              {...getTagProps({ index })}
                              key={tag}
                            />
                          ))
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            size="small"
                            placeholder={segment.tags?.length ? undefined : (t('tagsInputPlaceholder') ?? 'Add tag…')}
                            aria-label={t('colTags') ?? 'Tags'}
                          />
                        )}
                      />
                    </TableCell>

                    <TableCell>
                      <IconButton
                        size="small"
                        aria-label={t('deleteSegment') ?? 'Delete segment'}
                        onClick={() => handleDeleteClick(segment.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
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
        content={
          (
            <Typography variant="body2">
              {t('deleteConfirmMessage') ?? <Skeleton width="13rem" />}
            </Typography>
          )
        }
        actions={
          (
            <>
              <Button variant="outlined" onClick={handleCancelDelete}>
                {t('deleteConfirmCancel') ?? <Skeleton width="4rem" />}
              </Button>

              <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                {t('deleteConfirmAction') ?? <Skeleton width="4rem" />}
              </Button>
            </>
          )
        }
        onClose={handleCancelDelete}
      />
    </Stack>
  );
}
