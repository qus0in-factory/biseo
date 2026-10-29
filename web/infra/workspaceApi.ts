import ky from 'ky'
import type { AppConfig, SendMessageInput, WorkspaceApiPort } from '../domain/ports'
import type { PaneSummary, TimelineItem } from '../domain/timeline'

const opts = { retry: 0, credentials: 'same-origin' as const }

export const workspaceApi: WorkspaceApiPort = {
  getConfig: () => ky.get('/api/config', opts).json<AppConfig>(),

  getPanes: async (ws: string) => {
    const res = await ky
      .get(`/api/workspaces/${encodeURIComponent(ws)}/panes`, opts)
      .json<{ panes: PaneSummary[] }>()
    return res.panes || []
  },

  getTimeline: async (ws: string) => {
    const res = await ky
      .get(`/api/timeline/messages?workspaceId=${encodeURIComponent(ws)}&limit=50`, opts)
      .json<{ items: TimelineItem[] }>()
    return res.items || []
  },

  sendMessage: (input: SendMessageInput) =>
    ky.post('/api/timeline/messages', { ...opts, json: input }).json(),

  getTurn: (id: string) =>
    ky.get(`/api/timeline/messages/${encodeURIComponent(id)}`, opts).json<TimelineItem>(),

  cancelTurn: async (id: string) => {
    await ky.delete(`/api/turns/${encodeURIComponent(id)}`, opts)
  },
}
