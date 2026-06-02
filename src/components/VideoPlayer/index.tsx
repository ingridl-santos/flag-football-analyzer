import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, IconButton, Slider, Stack, Typography } from '@mui/material';
import { SyntheticEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import useVideoPlayer from '../../hooks/useVideoPlayer';
import { formatTime } from '../../utils/formatTime';

export interface VideoPlayerProps {
  src: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  seekTo?: number | null;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onPlayStateChange: (isPlaying: boolean) => void;
  onSeek: (time: number) => void;
  onSeekConsumed?: () => void;
}

export default function VideoPlayer({
  src,
  currentTime,
  duration,
  isPlaying,
  seekTo,
  onTimeUpdate,
  onDurationChange,
  onPlayStateChange,
  onSeek,
  onSeekConsumed,
}: VideoPlayerProps) {
  const { t } = useTranslation('gameFootage');
  const { videoRef, seek, togglePlay } = useVideoPlayer(isPlaying);

  const onSeekConsumedRef = useRef(onSeekConsumed);

  onSeekConsumedRef.current = onSeekConsumed;

  useEffect(() => {
    if (seekTo != null) {
      seek(seekTo);
      onSeekConsumedRef.current?.();
    }
  }, [seekTo, seek]);

  const handleTimeUpdate = (e: SyntheticEvent<HTMLVideoElement>) => {
    onTimeUpdate(e.currentTarget.currentTime);
  };

  const handleLoadedMetadata = (e: SyntheticEvent<HTMLVideoElement>) => {
    onDurationChange(e.currentTarget.duration);
  };

  const handleSliderChange = (_: Event, value: number | number[]) => {
    const time = Array.isArray(value) ? value[0] : value;

    seek(time);
    onSeek(time);
  };

  const PlayPauseIcon = isPlaying ? PauseIcon : PlayArrowIcon;
  const playPauseLabel = isPlaying ? (t('pause') ?? 'Pause') : (t('play') ?? 'Play');
  const timestamp = `${formatTime(currentTime)} / ${formatTime(duration)}`;

  return (
    <Stack sx={{ gap: '1rem' }}>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.common.black,
          borderRadius: '0.5rem',
          overflow: 'hidden',
          aspectRatio: '16 / 9',
        }}
      >
        <video
          ref={videoRef}
          src={src}
          style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => onPlayStateChange(true)}
          onPause={() => onPlayStateChange(false)}
        >
          <track kind="captions" />
        </video>
      </Box>

      <Slider
        value={currentTime}
        min={0}
        max={duration || 1}
        step={0.1}
        onChange={handleSliderChange}
        aria-label={t('timeline') ?? 'Video timeline'}
        size="small"
      />

      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
        <IconButton
          onClick={togglePlay}
          aria-label={playPauseLabel}
          size="small"
        >
          <PlayPauseIcon />
        </IconButton>

        <Typography variant="body2">
          {timestamp}
        </Typography>
      </Stack>
    </Stack>
  );
}
