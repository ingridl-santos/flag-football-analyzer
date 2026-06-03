import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import { selectBreadcrumbs } from '../../../../redux/BreadcrumbSlice';
import { useAppSelector } from '../../../../redux/hooks';
import LayoutTemplate from '../../templates/LayoutTemplate';

const GITHUB_URL = 'https://github.com/ingridl-santos/flag-football-analyzer';

export default function LayoutPage() {
  const { t } = useTranslation('common');
  const { breadcrumbs } = useAppSelector(selectBreadcrumbs);

  return (
    <LayoutTemplate
      breadcrumbsItems={breadcrumbs}
      slotProps={{
        header: {
          title: t('appTitle'),
          menuEntries: [],
        },
        footer: {
          githubUrl: GITHUB_URL,
        },
      }}
    >
      <Outlet />
    </LayoutTemplate>
  );
}
