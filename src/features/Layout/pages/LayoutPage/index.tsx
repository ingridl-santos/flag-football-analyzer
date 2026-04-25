import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';

import { ROUTES } from '../../../../router/routeDefinitions';
import { toNamedRoute } from '../../../../router/router';
import LayoutTemplate from '../../templates/LayoutTemplate';

const GITHUB_URL = 'https://github.com/ingridl-santos/flag-football-analyzer';

const LayoutPage = () => {
  const { t } = useTranslation('common');
  const { pathname } = useLocation();

  const gameFootagePath = toNamedRoute(ROUTES.gameFootage);

  return (
    <LayoutTemplate
      slotProps={{
        header: {
          title: t('appTitle'),
          menuEntries: [
            {
              id: 'gameFootage',
              label: t('nav.gameFootage'),
              to: gameFootagePath,
              active: pathname === gameFootagePath,
            },
          ],
          onMenuButtonClick: () => {},
        },
        footer: {
          githubUrl: GITHUB_URL,
        },
      }}
    >
      <Outlet />
    </LayoutTemplate>
  );
};

export default LayoutPage;
