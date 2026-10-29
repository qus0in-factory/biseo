import type { TimelineItem as T } from './timeline.js'
export const dummyItems: T[] = [
  { requestId: 'r1', workspaceId: 'w1', paneId: 'p1', targetName: 'T1', promptText: 'q1', status: 'queued', createdAt: '2026-10-28T00:00:00Z' },
  { requestId: 'r2', workspaceId: 'w1', paneId: 'p1', targetName: 'T1', promptText: 'q2', status: 'completed', responseText: 'd', createdAt: '2026-10-28T00:00:00Z' },
  { requestId: 'r3', workspaceId: 'w1', paneId: 'p1', targetName: 'T1', promptText: 'q3', status: 'working', createdAt: '2026-10-28T00:00:00Z' },
]
