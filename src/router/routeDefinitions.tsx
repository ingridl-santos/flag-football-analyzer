import { lazy } from 'react';

import * as Errors from '../features/Errors';
import type { NamedRouteObject } from '../types/router';

const App = lazy(() => import('../App'));
const Layout = lazy(() => import('../features/Layout/pages/LayoutPage'));

const HomePage = lazy(() => import('../features/Home'));

export const ROUTES = {
  home: 'HomePage',
} as const;

export const ROUTES_DEFINITIONS: NamedRouteObject[] = [
  {
    element: <App />,
    errorElement: <Errors.ErrorPage />,
    children: [
      {
        element: <Layout />,
        errorElement: <Errors.ErrorPage />,
        children: [
          {
            name: ROUTES.home,
            path: '/',
            element: <HomePage />,
            errorElement: <Errors.ErrorPage />,
          },
        ],
      },
    ],
  },
];
