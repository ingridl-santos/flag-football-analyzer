import { ChangeEvent, ReactNode } from 'react';

import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button, Card, CardContent, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import VideoPlayer from '../../../../components/VideoPlayer';
import YouTubePlayer from '../../../../components/YouTubePlayer';
import { type Segment } from '../../../../redux/SegmentSlice';
import SegmentTimeline from '../SegmentTimeline';
import YouTubeUrlInput from '../YouTubeUrlInput';

export interface VideoPlayerSectionProps {
  videoType: 'file' | 'youtube' | null;
  videoUrl: string | null;
  videoFileName: string | null;
  youtubeVideoId: string | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  seekTo?: number | null;
  segments: Segment[];
  activeSegmentId: string | null;
  controls?: ReactNode;
  onFileSelect?: (file: File) => void;
  onYouTubeUrl?: (videoId: string) => void;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onSeek?: (time: number) => void;
  onSeekConsumed?: () => void;
  onSegmentClick?: (id: string) => void;
}

export default function VideoPlayerSection({
  videoType,
  videoUrl,
  videoFileName,
  youtubeVideoId,
  currentTime,
  duration,
  isPlaying,
  seekTo,
  segments,
  activeSegmentId,
  controls,
  onFileSelect,
  onYouTubeUrl,
  onTimeUpdate,
  onDurationChange,
  onPlayStateChange,
  onSeek,
  onSeekConsumed,
  onSegmentClick,
}: VideoPlayerSectionProps) {
  const { t } = useTranslation('gameFootage');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) onFileSelect?.(file);
  };

  if (videoType === null) {
    return (
      <Stack
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: '32rem' }}>
          <CardContent>
            <Stack sx={{ alignItems: 'center', gap: '1.5rem', paddingY: '1rem' }}>
              <UploadFileIcon
                aria-hidden="true"
                sx={{ fontSize: '3.5rem', color: (theme) => theme.palette.primary.main }}
              />

              <Stack sx={{ alignItems: 'center', gap: '0.5rem' }}>
                <Typography variant="h5" component="p" sx={{ textAlign: 'center' }}>
                  {t('uploadPrompt') ?? <Skeleton sx={{ maxWidth: '18rem' }} />}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {t('uploadAccepted') ?? <Skeleton sx={{ maxWidth: '10rem' }} />}
                </Typography>
              </Stack>

              <Button component="label" variant="contained" size="large">
                {t('uploadButton') ?? <Skeleton width="6rem" />}

                <input
                  type="file"
                  accept="video/mp4"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>

              <Divider sx={{ width: '100%' }}>
                {t('orSeparator') ?? <Skeleton width="1.5rem" />}
              </Divider>

              <YouTubeUrlInput onSubmit={onYouTubeUrl ?? (() => {})} />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    );
  }

  const videoPlayer = videoType === 'youtube' && youtubeVideoId
    ? (
        <YouTubePlayer
          videoId={youtubeVideoId}
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          seekTo={seekTo}
          endControls={controls}
          onTimeUpdate={onTimeUpdate ?? (() => {})}
          onDurationChange={onDurationChange ?? (() => {})}
          onPlayStateChange={onPlayStateChange ?? (() => {})}
          onSeekConsumed={onSeekConsumed}
        />
      )
    : (
        <VideoPlayer
          src={videoUrl as string}
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          seekTo={seekTo}
          endControls={controls}
          onTimeUpdate={onTimeUpdate ?? (() => {})}
          onDurationChange={onDurationChange ?? (() => {})}
          onPlayStateChange={onPlayStateChange ?? (() => {})}
          onSeek={onSeek ?? (() => {})}
          onSeekConsumed={onSeekConsumed}
        />
      );

  return (
    <Stack sx={{ gap: '1rem' }}>
      <Card>
        <CardContent>
          <Stack sx={{ gap: '1rem' }}>
            {videoFileName && (
              <Typography variant="subtitle2" color="text.secondary">
                {videoFileName}
              </Typography>
            )}

            {videoPlayer}
          </Stack>
        </CardContent>
      </Card>

      {segments.length > 0 && (
        <SegmentTimeline
          segments={segments}
          duration={duration}
          currentTime={currentTime}
          activeSegmentId={activeSegmentId}
          onSegmentClick={onSegmentClick}
        />
      )}
    </Stack>
  );
}
