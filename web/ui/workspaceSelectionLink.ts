import type { AppConfig, WorkspaceApiPort } from '../domain/ports'

export type WorkspaceSelector = (workspaceId: string) => Promise<AppConfig | null>

// The mounted dashboard links its controller selector so the settings picker applies the same success path.
let linked: WorkspaceSelector | null = null

export const linkWorkspaceSelector = (selector: WorkspaceSelector) => {
 linked = selector
 return () => { if (linked === selector) linked = null }
}

export const resolveWorkspaceSelector = (api: WorkspaceApiPort): WorkspaceSelector | null => {
 if (linked) return linked
 const select = api.selectWorkspace
 return select ? (id) => select.call(api, id) : null
}
