import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import LayoutTemplate from '../../templates/LayoutTemplate';

const GITHUB_URL = 'https://github.com/ingridl-santos/flag-football-analyzer';

const LayoutPage = () => {
  const { t } = useTranslation('common');

  return (
    <LayoutTemplate
      slotProps={{
        header: {
          title: t('appTitle'),
          menuEntries: [],
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
