import type { RouteObject } from 'react-router'
import { dashboardRoute } from './dashboardRoute'
import { panesRoute } from './panesRoute'
import { chatRoutes } from './chatRoute'
import { historyRoute } from './historyRoute'

export const appRoutes: RouteObject[] = [
  dashboardRoute,
  panesRoute,
  ...chatRoutes,
  historyRoute,
]
