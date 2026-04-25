import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

export default function HomeTemplate() {
  const { t } = useTranslation('home');

  return (
    <Stack
      sx={{
        alignItems: 'center',
        paddingY: '4rem',
        gap: '3rem',
      }}
    >
      <Stack
        sx={{
          alignItems: 'center',
          gap: '1rem',
          maxWidth: '40rem',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" component="h1">
          {t('header')}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {t('description')}
        </Typography>
      </Stack>

      <Stack sx={{ width: '100%', maxWidth: '40rem', gap: '1.5rem' }}>
        <Typography variant="h5" component="h2">
          {t('featuresTitle')}
        </Typography>

        <Card>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <Typography variant="h6" component="h3">
              {t('features.gameFootage.title')}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {t('features.gameFootage.description')}
            </Typography>

            <Button
              variant="contained"
              component={RouterLink}
              to="/game-footage"
              sx={{ alignSelf: 'flex-start' }}
            >
              {t('getStarted')}
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
}
