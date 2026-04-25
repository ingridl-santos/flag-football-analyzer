import { lazy } from 'react';

import * as Errors from '../features/Errors';
import type { NamedRouteObject } from '../types/router';

const App = lazy(() => import('../App'));
const Layout = lazy(() => import('../features/Layout/pages/LayoutPage'));

const GameFootagePage = lazy(() => import('../features/GameFootage/pages/GameFootagePage'));

export const ROUTES = {
  gameFootage: 'GameFootagePage',
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
            name: ROUTES.gameFootage,
            path: '/',
            element: <GameFootagePage />,
            errorElement: <Errors.ErrorPage />,
          },
        ],
      },
    ],
  },
];
