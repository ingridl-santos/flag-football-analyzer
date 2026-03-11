import { createBrowserRouter, generatePath } from 'react-router-dom';

import { ROUTES, ROUTES_DEFINITIONS } from './routeDefinitions';
import type { NamedRouteObject, FlattenedNamedRouteObject } from '../types/router';

const generateRoutesNamesAndPaths = (routes: NamedRouteObject[]): FlattenedNamedRouteObject[] => {
  const flattenedRoutes: FlattenedNamedRouteObject[] = [];

  const recursiveFlattener = (route: NamedRouteObject) => {
    if (route.name && route.path && (!route.children || !route.children.length)) {
      flattenedRoutes.push({ name: route.name, path: route.path });
    } else if (route.name && route.path && (route.children && route.children.length > 0)) {
      flattenedRoutes.push({ name: route.name, path: route.path });
      route.children.forEach((childRoute) => recursiveFlattener(childRoute));
    } else if (route.path && (route.children && route.children.length > 0)) {
      route.children.forEach((childRoute) => recursiveFlattener(childRoute));
    } else if (route.children && route.children.length > 0) {
      route.children.forEach((childRoute) => recursiveFlattener(childRoute));
    }
  };

  routes.forEach((route) => recursiveFlattener(route));

  return flattenedRoutes;
};

export const FLATTENED_ROUTES = generateRoutesNamesAndPaths(ROUTES_DEFINITIONS);

export const toNamedRoute = (name: typeof ROUTES[keyof typeof ROUTES] | string, params?: Record<string, unknown>): string => {
  const matchedRoute = FLATTENED_ROUTES.find((route) => route.name && route.name === name);
  return (matchedRoute && matchedRoute.path) ? generatePath(matchedRoute.path, params) : '';
};

export default createBrowserRouter(ROUTES_DEFINITIONS);
