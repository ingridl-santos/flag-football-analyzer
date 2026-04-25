import { useTranslation } from 'react-i18next';

import useDocumentTitle from '../../../hooks/useDocumentTitle';
import HomeTemplate from '../templates/HomeTemplate';

export default function HomePage() {
  const { t } = useTranslation('pageTitles');
  useDocumentTitle(t('home'));

  return <HomeTemplate />;
}
