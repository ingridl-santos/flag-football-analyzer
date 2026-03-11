import { lazy } from 'react';

import type { NamedRouteObject } from '../types/router';

const App = lazy(() => import('../App'));

const HomePage = lazy(() => import('../features/Home'));
const TodoListPage = lazy(() => import('../features/TodoListPage'));

export const ROUTES = {
  home: 'HomePage',
  todoList: 'TodoListPage',
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
      {
        name: ROUTES.todoList,
        path: '/todo',
        element: <TodoListPage />,
      },
    ],
  },
];
