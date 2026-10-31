import ky from 'ky'
import type { AppConfig, WorkspaceSummary } from '../domain/ports'
import { opts } from './apiOptions'
export const listWorkspaces = async () => (await ky.get('/api/workspaces', opts).json<{ workspaces: WorkspaceSummary[] }>()).workspaces ?? []
export const selectWorkspace = async (ws: string) => ky.post('/api/workspaces/select', { ...opts, json: { workspaceId: ws } }).json<AppConfig>()