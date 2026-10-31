import ky from 'ky'
import type { AppConfig, SendMessageInput, WorkspaceApiPort, WorkspaceSummary } from '../domain/ports'
import type { PaneSummary, TimelineItem } from '../domain/timeline'
import { opts } from './apiOptions'
import { getTimelinePage } from './timelineApi'

export const workspaceApi: WorkspaceApiPort = {
  getConfig: () => ky.get('/api/config', opts).json<AppConfig>(),

  listWorkspaces: async () =>
    (await ky.get('/api/workspaces', opts).json<{ workspaces: WorkspaceSummary[] }>()).workspaces ?? [],

  selectWorkspace: async (ws: string) =>
    ky.post('/api/workspaces/select', { ...opts, json: { workspaceId: ws } }).json<AppConfig>(),

  getPanes: async (ws: string) => {
    const res = await ky
      .get(`/api/workspaces/${encodeURIComponent(ws)}/panes`, opts)
      .json<{ panes: PaneSummary[] }>()
    return res.panes || []
  },

  getTimeline: getTimelinePage,

  sendMessage: (input: SendMessageInput) =>
    ky.post('/api/timeline/messages', { ...opts, json: input }).json(),

  getTurn: (id: string) =>
    ky.get(`/api/timeline/messages/${encodeURIComponent(id)}`, opts).json<TimelineItem>(),

  cancelTurn: async (id: string) => {
    await ky.delete(`/api/turns/${encodeURIComponent(id)}`, opts)
  },
}
