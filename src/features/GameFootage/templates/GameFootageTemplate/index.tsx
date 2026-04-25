import { ChangeEvent } from 'react';

import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button, Card, CardContent, CircularProgress, Divider, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import VideoPlayer from '../../../../components/VideoPlayer';
import YouTubePlayer from '../../../../components/YouTubePlayer';
import { type Segment } from '../../../../redux/SegmentSlice';
import { formatTime } from '../../../../utils/formatTime';
import PlayTypeSelector from '../../components/PlayTypeSelector';
import SegmentTable from '../../components/SegmentTable';
import TagSuggestions from '../../components/TagSuggestions';
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
  pendingPlayType: string;
  pendingTags: string[];
  segments: Segment[];
  onFileSelect: (file: File) => void;
  onYouTubeUrl: (videoId: string) => void;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onPlayStateChange: (isPlaying: boolean) => void;
  onSeek: (time: number) => void;
  onSetStart: () => void;
  onSetEnd: () => void;
  onSetPendingPlayType: (playType: string) => void;
  onSetPendingTags: (tags: string[]) => void;
  onCreateSegment: () => void;
  onDeleteSegment: (id: string) => void;
  onSetPlayType: (id: string, playType: string) => void;
  onSetTags: (id: string, tags: string[]) => void;
  onExportCsv: () => void;
  onExportJson: () => void;
  onExportZip: () => void;
  isExportingZip: boolean;
  exportZipProgress: number;
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
  pendingPlayType,
  pendingTags,
  segments,
  onFileSelect,
  onYouTubeUrl,
  onTimeUpdate,
  onDurationChange,
  onPlayStateChange,
  onSeek,
  onSetStart,
  onSetEnd,
  onSetPendingPlayType,
  onSetPendingTags,
  onCreateSegment,
  onDeleteSegment,
  onSetPlayType,
  onSetTags,
  onExportCsv,
  onExportJson,
  onExportZip,
  isExportingZip,
  exportZipProgress,
}: GameFootageTemplateProps) {
  const { t } = useTranslation('gameFootage');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) onFileSelect(file);
  };

  const uploadArea = (
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
              <Typography variant="h6" component="p" sx={{ textAlign: 'center' }}>
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

            <Divider sx={{ width: '100%' }}>{t('orSeparator') ?? <Skeleton width="1.5rem" />}</Divider>

            <YouTubeUrlInput onSubmit={onYouTubeUrl} />
          </Stack>
        </CardContent>
      </Card>
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
    <Grid container spacing="1.5rem" sx={{ alignItems: 'flex-start' }}>
      {/* Left column — video + controls */}
      <Grid item xs={12} lg={7}>
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

                <Stack sx={{ flexDirection: 'row', gap: '0.75rem', flexWrap: 'wrap' }}>
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
            </CardContent>
          </Card>

          {canCreateSegment && (
            <Card>
              <CardContent>
                <Stack sx={{ gap: '0.75rem' }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('pendingSegmentSetup') ?? <Skeleton width="10rem" />}
                  </Typography>

                  <PlayTypeSelector
                    segmentId="pending"
                    value={pendingPlayType}
                    onChange={(_, playType) => onSetPendingPlayType(playType)}
                  />

                  <TagSuggestions
                    playType={pendingPlayType}
                    duration={pendingEnd - pendingStart}
                    existingTags={pendingTags}
                    onAddTag={(tag) => onSetPendingTags([...pendingTags, tag])}
                  />
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Grid>

      {/* Right column — segments */}
      <Grid item xs={12} lg={5}>
        <Card>
          <CardContent>
            <Stack sx={{ gap: '1rem' }}>
              <Stack
                sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <Typography variant="h6" component="h2">
                  {t('segments') ?? <Skeleton width="6rem" />}
                </Typography>

                <Stack sx={{ flexDirection: 'row', gap: '0.5rem', flexWrap: 'wrap' }}>
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

                  {videoType === 'file' && (
                    <Button
                      variant="contained"
                      size="small"
                      disabled={segments.length === 0 || isExportingZip}
                      onClick={onExportZip}
                      startIcon={isExportingZip
                        ? (
                            <CircularProgress
                              size="1rem"
                              aria-hidden="true"
                              sx={{ color: (theme) => theme.palette.primary.contrastText }}
                            />
                          )
                        : undefined}
                    >
                      {isExportingZip
                        ? (
                            t('exportZipProgress', { progress: Math.round(exportZipProgress * 100) })
                            ?? <Skeleton width="9rem" />
                          )
                        : (t('exportZip') ?? <Skeleton width="7rem" />)}
                    </Button>
                  )}
                </Stack>
              </Stack>

              {videoType === 'youtube' && (
                <Typography variant="caption" color="text.secondary">
                  {t('exportZipUnavailableYoutube') ?? <Skeleton sx={{ maxWidth: '28rem' }} />}
                </Typography>
              )}

              <SegmentTable
                segments={segments}
                onDelete={onDeleteSegment}
                onSetPlayType={onSetPlayType}
                onSetTags={onSetTags}
              />
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Stack sx={{ gap: '2rem' }}>
      {videoType === null ? uploadArea : playerArea}
    </Stack>
  );
}
