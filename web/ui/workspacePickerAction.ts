import type { WorkspaceApiPort } from '../domain/ports'
import r from '../resources.json'
import { selectWorkspaceAndRefresh } from './workspacePickerSelect'
import { resolveWorkspaceSelector, type WorkspaceSelector } from './workspaceSelectionLink'

type Store = {
 setLd: (loading: boolean) => void
 setCur: (workspaceId: string) => void
 setNote: (notice: string | null) => void
 load: () => Promise<void> | void
}

export const pickWorkspace = (
 api: WorkspaceApiPort,
 selector: WorkspaceSelector | null | undefined,
 id: string,
 store: Store,
 onSelected: ((workspaceId: string) => void) | undefined,
 setError: (error: string | null) => void,
) => selectWorkspaceAndRefresh(selector ?? resolveWorkspaceSelector(api), id, {
 setLoading: store.setLd,
 setError: (key) => setError(key ? r.connection_unavailable : null),
 setCurrent: store.setCur,
 setNotice: store.setNote,
 onSelected,
 reload: store.load,
})
