import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation('home');

  return (
    <Stack sx={{ alignItems: 'center' }}>
      <Typography variant="h1">
        { t('header') }
      </Typography>

      <Typography variant="h5" sx={{ mt: 4 }}>
        { t('description') }
      </Typography>
    </Stack>
  );
};

export default Home;
