import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import LayoutTemplate from '../../templates/LayoutTemplate';

const GITHUB_URL = 'https://github.com/ingridl-santos/flag-football-analyzer';

const LayoutPage = () => {
  const { t } = useTranslation('common');

  return (
    <LayoutTemplate title={t('appTitle')} githubUrl={GITHUB_URL}>
      <Outlet />
    </LayoutTemplate>
  );
};

export default LayoutPage;
