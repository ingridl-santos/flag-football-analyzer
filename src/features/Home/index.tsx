/* eslint-disable @darwin/no-hard-coded-text */
import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { ROUTES } from '../../router/routeDefinitions';
import { toNamedRoute } from '../../router/router';

const Home = () => {
  const { t } = useTranslation('home');

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(toNamedRoute(ROUTES.todoList));
  };

  return (
    <Stack alignItems="center">
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Link
          data-testid="ReactDocumentationLink-test-id"
          to="https://react.dev"
          target="_blank"
        >
          <img
            data-testid="ReactLogoImg-test-id"
            src="/react.svg"
            alt="React logo"
          />
        </Link>

        <img
          data-testid="WileyLogoImg-test-id"
          src="/wileyLogo.png"
          alt="Wiley Logo"
          style={{ maxWidth: 300 }}
        />
      </Stack>

      <Typography variant="h1">
        { t('header') }
      </Typography>

      <Typography variant="h5" sx={{ mt: 4 }}>
        { t('description') }
      </Typography>

      <Button
        data-testid="GoToTodoButton-test-id"
        variant="contained"
        onClick={handleNavigate}
        sx={{ mt: 4 }}
      >
        { t('goToTodo') }
      </Button>
    </Stack>
  );
};

export default Home;
