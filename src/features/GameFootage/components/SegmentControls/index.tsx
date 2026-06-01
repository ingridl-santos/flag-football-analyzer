import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Autocomplete, Button, Card, CardContent, Chip, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { formatTime } from '../../../../utils/formatTime';
import { suggestTags } from '../../../../utils/suggestTags';
import PlayTypeSelector from '../PlayTypeSelector';

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

      {canCreateSegment && (
        <Card>
          <CardContent>
            <Stack sx={{ gap: '0.75rem' }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('pendingSegmentSetup') ?? <Skeleton width="10rem" />}
              </Typography>

              <PlayTypeSelector
                segmentId="pending"
                value={pendingPlayType}
                onChange={(_, playType) => onSetPendingPlayType?.(playType)}
              />

              {(() => {
                const duration = (pendingEnd ?? 0) - (pendingStart ?? 0);
                const { auto, more } = suggestTags(pendingPlayType, duration);
                const autoSet = new Set(auto);
                const options = [
                  ...auto,
                  ...more.filter((tag) => !auto.includes(tag)),
                ].filter((opt) => !pendingTags.includes(opt));

                return (
                  <Autocomplete
                    multiple
                    freeSolo
                    options={options}
                    value={pendingTags}
                    onChange={(_, newValue) => onSetPendingTags?.(newValue as string[])}
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
                        placeholder={pendingTags.length ? undefined : (t('tagsInputPlaceholder') ?? undefined)}
                        inputProps={{
                          ...params.inputProps,
                          'aria-label': t('tagsLabel'),
                        }}
                      />
                    )}
                  />
                );
              })()}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
