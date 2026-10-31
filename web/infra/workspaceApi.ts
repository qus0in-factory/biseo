import ky from 'ky'
import type { AppConfig, SendMessageInput, WorkspaceApiPort } from '../domain/ports'
import type { PaneSummary, TimelineItem } from '../domain/timeline'
import { opts } from './apiOptions'
import { getTimelinePage } from './timelineApi'
import { listWorkspaces, selectWorkspace } from './workspaceListApi'

export const workspaceApi: WorkspaceApiPort = {
  getConfig: () => ky.get('/api/config', opts).json<AppConfig>(),
  listWorkspaces,
  selectWorkspace,
  getPanes: async (ws: string) => (await ky.get(`/api/workspaces/${encodeURIComponent(ws)}/panes`, opts).json<{ panes: PaneSummary[] }>()).panes || [],
  getTimeline: getTimelinePage,
  sendMessage: (input: SendMessageInput) =>
    ky.post('/api/timeline/messages', { ...opts, json: input }).json(),
  getTurn: (id: string) =>
    ky.get(`/api/timeline/messages/${encodeURIComponent(id)}`, opts).json<TimelineItem>(),
  cancelTurn: async (id: string) => { await ky.delete(`/api/turns/${encodeURIComponent(id)}`, opts) },
  openPane: async (input: { templateId?: string; name?: string }) => {
    const r = await ky.post('/api/panes', { ...opts, json: input }).json<{ paneId: string }>()
    return { paneId: r.paneId }
  },
  closePane: async (paneId: string) => { await ky.delete(`/api/panes/${encodeURIComponent(paneId)}`, opts) },
  renamePane: async (paneId: string, name: string) => { await ky.post(`/api/panes/${encodeURIComponent(paneId)}/rename`, { ...opts, json: { name } }) },
}