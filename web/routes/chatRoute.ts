import type { RouteObject } from 'react-router'
import { ChatPage } from '../pages/ChatPage'

export const chatRoutes: RouteObject[] = [
  { path: '/chat', Component: ChatPage },
  { path: '/chat/:paneId', Component: ChatPage },
]
