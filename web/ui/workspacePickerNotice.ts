import type { WorkspaceSummary } from '../domain/ports'
import r from '../resources.json'

export const missingWorkspaceNotice = (
 current: string | null,
 items: WorkspaceSummary[],
 loading: boolean,
 error: string | null,
) => !loading && !error && !!current && !items.some((w) => (w.workspaceId ?? w.id) === current)
 ? r.workspaceUnavailable
 : null
