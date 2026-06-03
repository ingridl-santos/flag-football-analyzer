import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Autocomplete,
  Box,
  Chip,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { memo, useCallback, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { type PlayDown, type PlaySide, type Segment } from '../../../../redux/SegmentSlice';
import { formatTime } from '../../../../utils/formatTime';
import { suggestTags } from '../../../../utils/suggestTags';

type ResultOption = { value: string; labelKey: string };

const OFFENSE_PASS_RESULTS: readonly ResultOption[] = [
  { value: 'Touchdown', labelKey: 'classifier.resultTouchdown' },
  { value: 'Completion', labelKey: 'classifier.resultCompletion' },
  { value: 'Incompletion', labelKey: 'classifier.resultIncompletion' },
  { value: 'Interception', labelKey: 'classifier.resultInterception' },
  { value: 'Sack', labelKey: 'classifier.resultSack' },
  { value: 'Flag Pull', labelKey: 'classifier.resultFlagPull' },
];

const OFFENSE_RUN_RESULTS: readonly ResultOption[] = [
  { value: 'Touchdown', labelKey: 'classifier.resultTouchdown' },
  { value: 'Big Gain', labelKey: 'classifier.resultBigGain' },
  { value: 'Short Gain', labelKey: 'classifier.resultShortGain' },
  { value: 'Loss', labelKey: 'classifier.resultLoss' },
  { value: 'Flag Pull', labelKey: 'classifier.resultFlagPull' },
];

const DEFENSE_RESULTS: readonly ResultOption[] = [
  { value: 'Flag Pull', labelKey: 'classifier.resultFlagPull' },
  { value: 'Sack', labelKey: 'classifier.resultSack' },
  { value: 'Interception', labelKey: 'classifier.resultInterception' },
  { value: 'Pick Six', labelKey: 'classifier.resultPickSix' },
  { value: 'Touchdown Allowed', labelKey: 'classifier.resultTouchdownAllowed' },
  { value: 'Forced Incompletion', labelKey: 'classifier.resultForcedIncompletion' },
];

const DOWNS: readonly PlayDown[] = [1, 2, 3, 4];

function StepLabel({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      fontWeight={600}
      sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
    >
      {children}
    </Typography>
  );
}

interface ResultChipProps {
  value: ResultOption['value'];
  labelKey: ResultOption['labelKey'];
  selected: boolean;
  onToggle: (value: string) => void;
}

const ResultChip = memo(function ResultChip({ value, labelKey, selected, onToggle }: ResultChipProps) {
  const { t } = useTranslation('gameFootage');
  const handleClick = useCallback(() => onToggle(value), [onToggle, value]);

  return (
    <Chip
      label={t(labelKey) ?? value}
      size="small"
      onClick={handleClick}
      variant={selected ? 'filled' : 'outlined'}
      color={selected ? 'primary' : 'default'}
    />
  );
});

export interface PlayClassifierProps {
  segment: Segment;
  segmentNumber: number;
  totalSegments?: number;
  hasPrev?: boolean;
  hasNext?: boolean;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  onSetSide: (id: string, side: PlaySide | undefined) => void;
  onSetDown: (id: string, down: PlayDown | undefined) => void;
  onSetPlayType: (id: string, playType: string | undefined) => void;
  onSetResult: (id: string, result: string | undefined) => void;
  onSetPlayer: (id: string, player: string | undefined) => void;
  onSetTags: (id: string, tags: string[]) => void;
}

export default function PlayClassifier({
  segment,
  segmentNumber,
  totalSegments,
  hasPrev,
  hasNext,
  onNavigatePrev,
  onNavigateNext,
  onSetSide,
  onSetDown,
  onSetPlayType,
  onSetResult,
  onSetPlayer,
  onSetTags,
}: PlayClassifierProps) {
  const { t } = useTranslation('gameFootage');

  const timeRange = `${formatTime(segment.start)} \u2192 ${formatTime(segment.end)}`;

  const resultOptions = useMemo(() => {
    if (segment.side === 'defense') return DEFENSE_RESULTS;
    if (segment.playType === 'Pass') return OFFENSE_PASS_RESULTS;
    if (segment.playType === 'Run') return OFFENSE_RUN_RESULTS;
    return [];
  }, [segment.side, segment.playType]);

  const legacyPlayType
    = segment.side === 'defense'
      ? 'Defense'
      : segment.playType ?? '';

  const { tagOptions, autoSet } = useMemo(() => {
    const { auto, more } = suggestTags(legacyPlayType, segment.duration);
    const set = new Set(auto);
    const opts = [
      ...auto,
      ...more.filter((tag) => !auto.includes(tag)),
    ].filter((opt) => !(segment.tags ?? []).includes(opt));
    return { tagOptions: opts, autoSet: set };
  }, [legacyPlayType, segment.duration, segment.tags]);

  // Local state for the player text field prevents cursor-position loss caused
  // by Redux round-trips on every keystroke. The parent resets this component
  // via key={segment.id} when the selected segment changes.
  const [playerInput, setPlayerInput] = useState(segment.player ?? '');

  const handleSideChange = useCallback((_: unknown, newSide: PlaySide | null) => {
    // setSide in the reducer clears playType and result automatically.
    onSetSide(segment.id, newSide ?? undefined);
  }, [segment.id, onSetSide]);

  const handleDownChange = useCallback((_: unknown, newDown: PlayDown | null) => {
    onSetDown(segment.id, newDown ?? undefined);
  }, [segment.id, onSetDown]);

  const handlePlayTypeChange = useCallback((_: unknown, newPlayType: string | null) => {
    // setPlayType in the reducer clears result automatically.
    onSetPlayType(segment.id, newPlayType ?? undefined);
  }, [segment.id, onSetPlayType]);

  const handleResultToggle = useCallback((value: string) => {
    onSetResult(segment.id, segment.result === value ? undefined : value);
  }, [segment.id, segment.result, onSetResult]);

  const handlePlayerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerInput(e.target.value);
    onSetPlayer(segment.id, e.target.value || undefined);
  }, [segment.id, onSetPlayer]);

  const handleTagsChange = useCallback((_: unknown, newValue: string[]) => {
    onSetTags(segment.id, newValue);
  }, [segment.id, onSetTags]);

  const showResults = segment.side === 'defense' || (segment.side === 'offense' && segment.playType !== undefined);

  return (
    <Stack sx={{ gap: '1.25rem' }}>
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0.5rem',
        }}
      >
        <Stack sx={{ gap: '0.125rem', flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {t('classifier.heading', { number: segmentNumber }) ?? (
              <Skeleton width="14rem" />
            )}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {totalSegments !== undefined && (
              <>
                {t('classifier.clipCounter', { current: segmentNumber, total: totalSegments })
                  ?? <Skeleton width="6rem" />}

                {' · '}
              </>
            )}

            {timeRange}

            {' · '}

            {formatTime(segment.duration)}
          </Typography>
        </Stack>

        {(onNavigatePrev || onNavigateNext) && (
          <Stack
            sx={{ flexDirection: 'row', gap: '0.25rem', flexShrink: 0 }}
            role="group"
            aria-label={t('classifier.clipNavigation')}
          >
            <IconButton
              size="small"
              onClick={onNavigatePrev}
              disabled={!hasPrev}
              aria-label={t('classifier.prevClip')}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              onClick={onNavigateNext}
              disabled={!hasNext}
              aria-label={t('classifier.nextClip')}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Stack>
        )}
      </Stack>

      <Stack sx={{ gap: '0.5rem' }}>
        <StepLabel>
          {t('classifier.phaseLabel') ?? <Skeleton width="3rem" />}
        </StepLabel>

        <ToggleButtonGroup
          exclusive
          value={segment.side ?? null}
          onChange={handleSideChange}
          size="small"
          aria-label={t('classifier.phaseLabel', { defaultValue: 'Phase' })}
        >
          <ToggleButton value="offense" sx={{ paddingX: '1.25rem' }}>
            {t('classifier.offense') ?? <Skeleton width="4rem" />}
          </ToggleButton>

          <ToggleButton value="defense" sx={{ paddingX: '1.25rem' }}>
            {t('classifier.defense') ?? <Skeleton width="4rem" />}
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {segment.side !== undefined && (
        <Stack sx={{ gap: '0.5rem' }}>
          <StepLabel>
            {t('classifier.downLabel') ?? <Skeleton width="3rem" />}
          </StepLabel>

          <ToggleButtonGroup
            exclusive
            value={segment.down ?? null}
            onChange={handleDownChange}
            size="small"
            aria-label={t('classifier.downLabel', { defaultValue: 'Down' })}
          >
            {DOWNS.map((d) => (
              <ToggleButton key={d} value={d} sx={{ minWidth: '3.25rem' }}>
                {t(`classifier.down${d}`) ?? <Skeleton width="2rem" />}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      )}

      {segment.side === 'offense' && (
        <Stack sx={{ gap: '0.5rem' }}>
          <StepLabel>
            {t('classifier.playLabel') ?? <Skeleton width="2.5rem" />}
          </StepLabel>

          <ToggleButtonGroup
            exclusive
            value={segment.playType ?? null}
            onChange={handlePlayTypeChange}
            size="small"
            aria-label={t('classifier.playLabel', { defaultValue: 'Play' })}
          >
            <ToggleButton value="Run" sx={{ paddingX: '1.25rem' }}>
              {t('classifier.run') ?? <Skeleton width="2.5rem" />}
            </ToggleButton>

            <ToggleButton value="Pass" sx={{ paddingX: '1.25rem' }}>
              {t('classifier.pass') ?? <Skeleton width="2.5rem" />}
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      )}

      {showResults && (
        <Stack sx={{ gap: '0.5rem' }}>
          <StepLabel>
            {t('classifier.resultLabel') ?? <Skeleton width="3.5rem" />}
          </StepLabel>

          <Stack sx={{ flexDirection: 'row', flexWrap: 'wrap', gap: '0.5rem' }}>
            {resultOptions.map(({ value, labelKey }) => (
              <ResultChip
                key={value}
                value={value}
                labelKey={labelKey}
                selected={segment.result === value}
                onToggle={handleResultToggle}
              />
            ))}
          </Stack>
        </Stack>
      )}

      {segment.side !== undefined && (
        <Stack sx={{ gap: '0.5rem' }}>
          <StepLabel>
            {t('classifier.playerLabel') ?? <Skeleton width="3.5rem" />}
          </StepLabel>

          <TextField
            variant="outlined"
            size="small"
            placeholder={t('classifier.playerPlaceholder', { defaultValue: 'e.g. #42, QB' })}
            value={playerInput}
            onChange={handlePlayerChange}
            inputProps={{
              'aria-label': t('classifier.playerLabel', { defaultValue: 'Player' }),
            }}
            sx={{ maxWidth: '14rem' }}
          />
        </Stack>
      )}

      {segment.side !== undefined && (
        <Stack sx={{ gap: '0.5rem' }}>
          <StepLabel>
            {t('classifier.tagsLabel') ?? <Skeleton width="2.5rem" />}
          </StepLabel>

          <Autocomplete
            multiple
            freeSolo
            options={tagOptions}
            value={segment.tags ?? []}
            onChange={handleTagsChange}
            getOptionLabel={(opt) => opt}
            renderOption={(props, opt) => (
              <Box component="li" {...props} key={opt}>
                <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                  {autoSet.has(opt) && (
                    <AutoAwesomeIcon
                      aria-hidden="true"
                      sx={{ color: (theme) => theme.palette.primary.main, fontSize: '0.875rem' }}
                    />
                  )}

                  <Typography component="span" variant="body2">{opt}</Typography>
                </Stack>
              </Box>
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
                variant="outlined"
                size="small"
                placeholder={segment.tags?.length ? undefined : t('tagsInputPlaceholder')}
                inputProps={{
                  ...params.inputProps,
                  'aria-label': t('classifier.tagsLabel', { defaultValue: 'Tags' }),
                }}
              />
            )}
          />
        </Stack>
      )}

      <Divider />
    </Stack>
  );
}
