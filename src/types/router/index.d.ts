import type { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';

interface NamedIndexRouteObject extends IndexRouteObject {
  name?: string,
}

interface NamedNonIndexRouteObject extends NonIndexRouteObject {
  name?: string,
  children?: NamedRouteObject[]
}

export type NamedRouteObject = NamedIndexRouteObject | NamedNonIndexRouteObject;

export interface FlattenedNamedRouteObject {
  name: string,
  path: string
}
