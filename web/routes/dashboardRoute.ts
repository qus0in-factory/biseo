import type { RouteObject } from 'react-router'
import { DashboardPage } from '../pages/DashboardPage'

export const dashboardRoute: RouteObject = {
  path: '/',
  Component: DashboardPage,
}
