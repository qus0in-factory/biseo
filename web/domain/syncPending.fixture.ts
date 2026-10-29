import type { TimelineItem } from './timeline.js'
import type { WorkspaceApiPort } from './ports.js'

export function makeMockApi(fetched: string[]): WorkspaceApiPort {
  return {
    getConfig: async () => ({ workspaceId: 'w1' }),
    getPanes: async () => [],
    sendMessage: async () => ({ requestId: 'r' }),
    getTurn: async (id: string): Promise<TimelineItem> => {
      fetched.push(id)
      return {
        requestId: id,
        workspaceId: 'w1',
        paneId: 'p1',
        targetName: 'T1',
        promptText: 'hi',
        status: 'completed',
        createdAt: '2026-10-28T00:00:00Z',
      }
    },
    cancelTurn: async () => {},
  }
}
