import VideoFileIcon from '@mui/icons-material/VideoFile';
import { Box, Card, CardActionArea, CardContent, Container, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export interface Feature {
  key: string;
  href: string;
  icon: React.ReactNode;
}

export interface HomeTemplateProps {
  features: Feature[];
}

export default function HomeTemplate({ features }: HomeTemplateProps) {
  const { t } = useTranslation('home');

  return (
    <Container maxWidth="lg" sx={{ paddingY: '4rem' }}>
      <Stack sx={{ gap: '3rem' }}>
        <Stack sx={{ gap: '1rem' }}>
          <Typography variant="h1" component="h1">
            {t('header') ?? <Skeleton sx={{ maxWidth: '16rem' }} />}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {t('description') ?? <Skeleton sx={{ maxWidth: '28rem' }} />}
          </Typography>
        </Stack>

        <Stack sx={{ gap: '1rem' }}>
          <Typography variant="h2">
            {t('featuresTitle') ?? <Skeleton sx={{ maxWidth: '8rem' }} />}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
              gap: '1.5rem',
            }}
          >
            {features.map((feature) => (
              <Card key={feature.key} variant="outlined">
                <CardActionArea
                  component="a"
                  href={feature.href}
                  sx={{ height: '100%' }}
                >
                  <CardContent>
                    <Stack sx={{ gap: '0.75rem' }}>
                      <Box sx={{ color: 'primary.main', fontSize: '2rem', lineHeight: 1 }}>
                        {feature.icon}
                      </Box>

                      <Stack sx={{ gap: '0.25rem' }}>
                        <Typography variant="h3" component="h3">
                          {t(`features.${feature.key}.title`) ?? <Skeleton sx={{ maxWidth: '8rem' }} />}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {t(`features.${feature.key}.description`) ?? <Skeleton sx={{ maxWidth: '14rem' }} />}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}

export { VideoFileIcon };
