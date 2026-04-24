import { lazy } from 'react';

import type { NamedRouteObject } from '../types/router';

const App = lazy(() => import('../App'));

const HomePage = lazy(() => import('../features/Home'));

export const ROUTES = {
  home: 'HomePage',
} as const;

export const ROUTES_DEFINITIONS: NamedRouteObject[] = [
  {
    element: <App />,
    children: [
      {
        name: ROUTES.home,
        path: '/',
        element: <HomePage />,
      },
    ],
  },
];
