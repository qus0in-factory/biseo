import type { WorkspaceApiPort } from '../domain/ports'
import { pickWorkspace } from './workspacePickerAction'
import { isWorkspaceSelectionPending } from './workspaceSelectionGuard'
import type { WorkspaceSelector } from './workspaceSelectionLink'

type Store = Parameters<typeof pickWorkspace>[3]

export const chooseWorkspaceTab = (
 api: WorkspaceApiPort,
 selector: WorkspaceSelector | null | undefined,
 id: string,
 current: string | null,
 store: Store,
 setError: (error: string | null) => void,
) => id === current || isWorkspaceSelectionPending()
 ? Promise.resolve(null)
 : pickWorkspace(api, selector, id, store, undefined, setError)
