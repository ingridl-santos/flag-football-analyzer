import './runtime-env'; // Must be first to guarantee environment variables are loaded before anything else

import { Suspense } from 'react';

import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import ErrorPage from './features/Errors/pages/ErrorPage';
import i18n from './i18n';
import { store } from './redux/store';
import Router from './router/router';

(async () => {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

  root.render(
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary fallback={<ErrorPage />}>
        <Provider store={store}>
          <Suspense fallback={null}>
            <RouterProvider router={Router} />
          </Suspense>
        </Provider>
      </ErrorBoundary>
    </I18nextProvider>,
  );
})();
