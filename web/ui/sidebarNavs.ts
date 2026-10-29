import type { TabName } from '../domain/schemas/routeParams'
import { Layers, MessageSquare } from 'lucide-react'

export const sidebarNavs: [TabName, string, typeof Layers][] = [
  ['panels', '패널', Layers],
  ['chat', '채팅', MessageSquare],
]
