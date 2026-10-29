import type { TabName } from '../domain/schemas/routeParams'
import { Layers, MessageSquare, History } from 'lucide-react'

export const sidebarNavs: [TabName, string, typeof Layers][] = [
  ['panels', '패널', Layers],
  ['chat', '채팅', MessageSquare],
  ['history', '히스토리', History],
]
