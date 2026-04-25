import { ChangeEvent } from 'react';

import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Button, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import VideoPlayer from '../../../../components/VideoPlayer';
import YouTubePlayer from '../../../../components/YouTubePlayer';
import { type Segment } from '../../../../redux/SegmentSlice';
import { formatTime } from '../../../../utils/formatTime';
import SegmentTable from '../../components/SegmentTable';
import YouTubeUrlInput from '../../components/YouTubeUrlInput';

export interface GameFootageTemplateProps {
  videoType: 'file' | 'youtube' | null;
  videoUrl: string | null;
  videoFileName: string | null;
  youtubeVideoId: string | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  pendingStart: number | null;
  pendingEnd: number | null;
  segments: Segment[];
  onFileSelect: (file: File) => void;
  onYouTubeUrl: (videoId: string) => void;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onPlayStateChange: (isPlaying: boolean) => void;
  onSeek: (time: number) => void;
  onSetStart: () => void;
  onSetEnd: () => void;
  onCreateSegment: () => void;
  onDeleteSegment: (id: string) => void;
  onSetPlayType: (id: string, playType: string) => void;
  onSetTags: (id: string, tags: string[]) => void;
  onExportCsv: () => void;
  onExportJson: () => void;
}

export default function GameFootageTemplate({
  videoType,
  videoUrl,
  videoFileName,
  youtubeVideoId,
  currentTime,
  duration,
  isPlaying,
  pendingStart,
  pendingEnd,
  segments,
  onFileSelect,
  onYouTubeUrl,
  onTimeUpdate,
  onDurationChange,
  onPlayStateChange,
  onSeek,
  onSetStart,
  onSetEnd,
  onCreateSegment,
  onDeleteSegment,
  onSetPlayType,
  onSetTags,
  onExportCsv,
  onExportJson,
}: GameFootageTemplateProps) {
  const { t } = useTranslation('gameFootage');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) onFileSelect(file);
  };

  const uploadArea = (
    <Stack
      sx={{
        border: '2px dashed',
        borderColor: (theme) => theme.palette.divider,
        borderRadius: '0.5rem',
        padding: '3rem',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <UploadFileIcon
        aria-hidden="true"
        sx={{ fontSize: '3rem', color: (theme) => theme.palette.text.secondary }}
      />

      <Typography variant="body1" color="text.secondary" textAlign="center">
        {t('uploadPrompt') ?? <Skeleton sx={{ maxWidth: '18rem' }} />}
      </Typography>

      <Typography variant="caption" color="text.secondary">
        {t('uploadAccepted') ?? <Skeleton sx={{ maxWidth: '10rem' }} />}
      </Typography>

      <Box
        component="label"
        sx={{
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: 'primary.main',
          color: (theme) => theme.palette.primary.contrastText,
          borderRadius: '0.25rem',
          padding: '0.375rem 1rem',
          typography: 'button',
          '&:hover': { backgroundColor: 'primary.dark' },
        }}
      >
        {t('uploadButton') ?? <Skeleton width="6rem" />}

        <input
          type="file"
          accept="video/mp4"
          hidden
          onChange={handleFileChange}
        />
      </Box>

      <Divider>{t('orSeparator') ?? <Skeleton width="1.5rem" />}</Divider>

      <YouTubeUrlInput onSubmit={onYouTubeUrl} />
    </Stack>
  );

  const canCreateSegment = pendingStart !== null && pendingEnd !== null && pendingStart < pendingEnd;

  const videoPlayer = videoType === 'youtube' && youtubeVideoId
    ? (
        <YouTubePlayer
          videoId={youtubeVideoId}
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          onTimeUpdate={onTimeUpdate}
          onDurationChange={onDurationChange}
          onPlayStateChange={onPlayStateChange}
        />
      )
    : (
        <VideoPlayer
          src={videoUrl as string}
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          onTimeUpdate={onTimeUpdate}
          onDurationChange={onDurationChange}
          onPlayStateChange={onPlayStateChange}
          onSeek={onSeek}
        />
      );

  const playerArea = (
    <Stack sx={{ gap: '2rem' }}>
      <Stack sx={{ gap: '1rem' }}>
        {videoFileName && (
          <Typography variant="subtitle2">
            {videoFileName}
          </Typography>
        )}

        {videoPlayer}

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
      </Stack>

      <Divider />

      <Stack sx={{ gap: '1rem' }}>
        <Stack sx={{ flexDirection: 'row', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            size="small"
            disabled={segments.length === 0}
            onClick={onExportCsv}
          >
            {t('exportCsv') ?? <Skeleton width="6rem" />}
          </Button>

          <Button
            variant="outlined"
            size="small"
            disabled={segments.length === 0}
            onClick={onExportJson}
          >
            {t('exportJson') ?? <Skeleton width="7rem" />}
          </Button>
        </Stack>

        <SegmentTable segments={segments} onDelete={onDeleteSegment} onSetPlayType={onSetPlayType} onSetTags={onSetTags} />
      </Stack>
    </Stack>
  );

  return (
    <Stack sx={{ gap: '2rem' }}>
      <Typography variant="h2" component="h1">
        {t('title') ?? <Skeleton sx={{ maxWidth: '9rem' }} />}
      </Typography>

      {videoType === null ? uploadArea : playerArea}
    </Stack>
  );
}
