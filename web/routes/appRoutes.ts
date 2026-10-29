import { redirect, type RouteObject } from 'react-router'
import { routePaths } from './routePaths'
import { dashboardRoute } from './dashboardRoute'
import { panesRoute } from './panesRoute'
import { chatRoutes } from './chatRoute'

export const appRoutes: RouteObject[] = [
  { ...dashboardRoute, path: routePaths[0] },
  { ...panesRoute, path: routePaths[1] },
  { ...chatRoutes[0], path: routePaths[2] },
  { ...chatRoutes[1], path: routePaths[3] },
  { path: '/history', loader: () => redirect('/panels') },
]
