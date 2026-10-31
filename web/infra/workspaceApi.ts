import ky from 'ky'
import type { AppConfig, SendMessageInput, WorkspaceApiPort } from '../domain/ports'
import type { TimelineItem } from '../domain/timeline'
import { opts } from './apiOptions'
import { getTimelinePage } from './timelineApi'
import { getPanes, listWorkspaces, selectWorkspace } from './workspaceListApi'
import { paneManageApi } from './paneManageApi'

export const workspaceApi: WorkspaceApiPort = {
  ...paneManageApi,
  getConfig: () => ky.get('/api/config', opts).json<AppConfig>(),
  listWorkspaces,
  selectWorkspace,
  getPanes,
  getTimeline: getTimelinePage,
  sendMessage: (input: SendMessageInput) =>
    ky.post('/api/timeline/messages', { ...opts, json: input }).json(),
  getTurn: (id: string) =>
    ky.get(`/api/timeline/messages/${encodeURIComponent(id)}`, opts).json<TimelineItem>(),
  cancelTurn: async (id: string) => { await ky.delete(`/api/turns/${encodeURIComponent(id)}`, opts) },
}
