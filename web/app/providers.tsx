import { QueryClient } from '@tanstack/react-query'
import { createBrowserRouter } from 'react-router'
import App from '../App'
import { appRoutes } from '../routes/appRoutes'

// Server state via Query only. No polling: SSE events invalidate.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
})

// Routes: panels / chat / history (+ per-route titles).
export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: appRoutes,
  },
])
