import { DependencyList, useLayoutEffect } from 'react';

import { useTranslation } from 'react-i18next';

function useDocumentTitle(title?: string | (() => string), deps: DependencyList = []): void {
  const { t } = useTranslation('pageTitles');

  useLayoutEffect(() => {
    if (!title) {
      document.title = t('appName');
      return;
    }

    if (typeof title === 'function') {
      document.title = t('documentTitle', {
        pageTitle: title(),
        appName: t('appName'),
      });
      return;
    }

    document.title = t('documentTitle', {
      pageTitle: title,
      appName: t('appName'),
    });
  }, [title, t, ...deps]);
}

export default useDocumentTitle;
