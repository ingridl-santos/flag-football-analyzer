import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TuneIcon from '@mui/icons-material/Tune';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { Box, Button, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import AppLogo from '../../../../components/AppLogo';
import MultilineSkelly, { MultilineSkellyProps } from '../../../../components/MultilineSkelly';

const highlights = [
  { key: 'upload', Icon: VideoLibraryIcon },
  { key: 'classify', Icon: TuneIcon },
  { key: 'export', Icon: FileDownloadIcon },
] as const;

const SKELETON_MAP: Record<string, MultilineSkellyProps> = {
  upload: { lines: 2, lastLineWidth: '70%' },
  classify: { lines: 2, lastLineWidth: '60%' },
  export: { lines: 2, lastLineWidth: '80%' },
};

export default function HomeTemplate() {
  const { t } = useTranslation('home');

  return (
    <Stack sx={{ gap: '4rem', paddingY: '1rem' }}>
      {/* Hero */}
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.grey[100],
          borderRadius: '1rem',
          padding: { xs: '2rem', md: '4rem' },
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <AppLogo width="4rem" height="4rem" aria-hidden="true" />

        <Stack sx={{ gap: '0.75rem', alignItems: 'center', maxWidth: '36rem' }}>
          <Typography variant="h1" component="h1">
            {t('header') ?? <Skeleton sx={{ maxWidth: '18rem' }} />}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {t('description') ?? <MultilineSkelly lines={2} lastLineWidth="60%" />}
          </Typography>
        </Stack>

        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/game-footage"
          endIcon={<ChevronRightIcon />}
        >
          {t('ctaButton') ?? <Skeleton width="8rem" />}
        </Button>
      </Box>

      {/* Highlights */}
      <Stack sx={{ gap: '1.5rem' }}>
        <Typography variant="h2" component="h2">
          {t('highlightsTitle') ?? <Skeleton sx={{ maxWidth: '14rem' }} />}
        </Typography>

        <Stack
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            gap: '1rem',
          }}
        >
          {highlights.map(({ key, Icon }) => (
            <Paper
              key={key}
              sx={{
                padding: '1.5rem',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <Box
                sx={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '0.5rem',
                  backgroundColor: (theme) => theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon
                  aria-hidden="true"
                  sx={{
                    color: (theme) => theme.palette.primary.contrastText,
                    fontSize: '1.25rem',
                  }}
                />
              </Box>

              <Typography variant="h3" component="h3">
                {t(`highlights.${key}.title`) ?? <Skeleton sx={{ maxWidth: '8rem' }} />}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {t(`highlights.${key}.description`) ?? <MultilineSkelly {...SKELETON_MAP[key]} />}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
