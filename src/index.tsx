import './runtime-env'; // Must be first to guarantee environment variables are loaded before anything else

import { Suspense } from 'react';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { store } from './redux/store';
import Router from './router/router';

import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const body = (
  <Provider store={store}>
    <Suspense fallback={null}>
      <RouterProvider router={Router} />
    </Suspense>
  </Provider>
);

root.render(body);
