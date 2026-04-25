import { useTranslation } from 'react-i18next';

import useDocumentTitle from '../../../hooks/useDocumentTitle';
import ErrorTemplate from '../templates/ErrorTemplate';

export default function ErrorPage() {
  const { t } = useTranslation('pageTitles');

  useDocumentTitle(t('error'));

  return (
    <ErrorTemplate />
  );
}
