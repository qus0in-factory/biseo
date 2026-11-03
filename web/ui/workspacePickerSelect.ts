import type { AppConfig } from '../domain/ports'
import type { WorkspaceSelector } from './workspaceSelectionLink'
import { beginWorkspaceSelection } from './workspaceSelectionGuard'

export interface WorkspaceSelectionHandlers {
 setLoading: (loading: boolean) => void
 setError: (error: string | null) => void
 setCurrent: (workspaceId: string) => void
 setNotice: (notice: string | null) => void
 onSelected?: (workspaceId: string) => void
 reload: () => Promise<void> | void
}

export async function selectWorkspaceAndRefresh(
 selector: WorkspaceSelector | null,
 workspaceId: string,
 handlers: WorkspaceSelectionHandlers,
): Promise<AppConfig | null> {
 if (!selector) return null
 const release = beginWorkspaceSelection()
 if (!release) return null
 handlers.setLoading(true)
 handlers.setError(null)
 try {
  const config = await selector(workspaceId)
  if (!config) return null
  handlers.setCurrent(config.workspaceId)
  handlers.setNotice(null)
  handlers.onSelected?.(config.workspaceId)
  await handlers.reload()
  return config
 } catch {
  handlers.setError('connection_unavailable')
  return null
 } finally {
  release()
  handlers.setLoading(false)
 }
}
