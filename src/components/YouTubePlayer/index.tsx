import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import useYouTubePlayer from '../../hooks/useYouTubePlayer';
import { formatTime } from '../../utils/formatTime';

export interface YouTubePlayerProps {
  videoId: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  seekTo?: number | null;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onPlayStateChange: (isPlaying: boolean) => void;
  onSeekConsumed?: () => void;
}

export default function YouTubePlayer({
  videoId,
  currentTime,
  duration,
  isPlaying,
  seekTo,
  onTimeUpdate,
  onDurationChange,
  onPlayStateChange,
  onSeekConsumed,
}: YouTubePlayerProps) {
  const { t } = useTranslation('gameFootage');
  const { containerRef, togglePlay, seek } = useYouTubePlayer(
    videoId,
    onTimeUpdate,
    onDurationChange,
    onPlayStateChange,
    isPlaying,
  );

  const onSeekConsumedRef = useRef(onSeekConsumed);

  onSeekConsumedRef.current = onSeekConsumed;

  useEffect(() => {
    if (seekTo != null) {
      seek(seekTo);
      onSeekConsumedRef.current?.();
    }
  }, [seekTo, seek]);

  const PlayPauseIcon = isPlaying ? PauseIcon : PlayArrowIcon;
  const playPauseLabel = isPlaying ? (t('pause') ?? 'Pause') : (t('play') ?? 'Play');
  const timestamp = `${formatTime(currentTime)} / ${formatTime(duration)}`;

  return (
    <Stack sx={{ gap: '1rem' }}>
      <Box
        ref={containerRef}
        sx={{
          width: '100%',
          backgroundColor: (theme) => theme.palette.common.black,
          borderRadius: '0.5rem',
          overflow: 'hidden',
          aspectRatio: '16 / 9',
          '& iframe': { width: '100% !important', height: '100% !important', display: 'block' },
        }}
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
