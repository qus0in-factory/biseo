import { selectWorkspaceAndRefresh } from './workspacePickerSelect'
import type { WorkspaceSelector } from './workspaceSelectionLink'

export const runSelection = (selector: WorkspaceSelector, log: string[]) =>
 selectWorkspaceAndRefresh(selector, 'w2', {
  setLoading: (v) => log.push(`loading:${v}`),
  setError: (v) => log.push(`error:${v}`),
  setCurrent: (v) => log.push(`current:${v}`),
  setNotice: (v) => log.push(`notice:${v}`),
  onSelected: (v) => log.push(`selected:${v}`),
  reload: async () => { log.push('reload') },
 })
