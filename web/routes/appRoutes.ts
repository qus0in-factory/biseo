import { redirect, type RouteObject } from 'react-router'
import { routePaths } from './routePaths'
import { dashboardRoute } from './dashboardRoute'
import { chatRoute } from './chatRoute'

export const appRoutes: RouteObject[] = [
  { ...dashboardRoute, path: routePaths[0] },
  { ...chatRoute, path: routePaths[1] },
  { path: '/panels', loader: () => redirect('/') },
  { path: '/chat', loader: () => redirect('/') },
  { path: '/history', loader: () => redirect('/') },
]
