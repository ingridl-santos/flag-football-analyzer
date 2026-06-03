import { Alert, Button, Card, CardContent, CircularProgress, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { type Segment } from '../../../../redux/SegmentSlice';
import SegmentTable from '../SegmentTable';

export interface SegmentPanelProps {
  videoType: 'file' | 'youtube' | null;
  segments: Segment[];
  readOnly?: boolean;
  activeSegmentId: string | null;
  isExportingZip: boolean;
  exportZipProgress: number;
  exportError?: string | null;
  onDelete?: (id: string) => void;
  onSetPlayType?: (id: string, playType: string) => void;
  onSetTags?: (id: string, tags: string[]) => void;
  onSegmentClick?: (id: string) => void;
  onExportCsv?: () => void;
  onExportJson?: () => void;
  onExportZip?: () => void;
}

export default function SegmentPanel({
  videoType,
  segments,
  readOnly,
  activeSegmentId,
  isExportingZip,
  exportZipProgress,
  exportError,
  onDelete,
  onSetPlayType,
  onSetTags,
  onSegmentClick,
  onExportCsv,
  onExportJson,
  onExportZip,
}: SegmentPanelProps) {
  const { t } = useTranslation('gameFootage');

  return (
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
            <Typography variant="h5" component="h2">
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

          <Divider />

          {exportError && (
            <Alert severity="error">
              <Stack sx={{ gap: '0.25rem' }}>
                <span>{t('exportZipError')}</span>

                <details>
                  <summary>
                    <Typography variant="caption">
                      {t('exportZipErrorDetails')}
                    </Typography>
                  </summary>

                  <Typography
                    variant="caption"
                    component="pre"
                    sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
                  >
                    {exportError}
                  </Typography>
                </details>
              </Stack>
            </Alert>
          )}

          {videoType === 'youtube' && (
            <Typography variant="caption" color="text.secondary">
              {t('exportZipUnavailableYoutube') ?? <Skeleton sx={{ maxWidth: '28rem' }} />}
            </Typography>
          )}

          <SegmentTable
            segments={segments}
            hideTitle
            readOnly={readOnly}
            activeSegmentId={activeSegmentId}
            onDelete={onDelete}
            onSetPlayType={onSetPlayType}
            onSetTags={onSetTags}
            onSegmentClick={onSegmentClick}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
