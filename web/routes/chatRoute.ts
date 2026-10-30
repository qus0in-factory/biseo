import type { RouteObject } from 'react-router'
import { ChatPage } from '../pages/ChatPage'

export const chatRoute: RouteObject = {
  path: '/chat/:paneId',
  Component: ChatPage,
}
