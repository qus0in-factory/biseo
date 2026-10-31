import { Button } from '../components/ui/button'
import type { WorkspaceSummary } from '../domain/ports'
import r from '../resources.json'
export interface WorkspacePickerItemProps {
  workspace: WorkspaceSummary
  selected: boolean
  loading: boolean
  onSelect: (id: string) => void
}
export function WorkspacePickerItem({ workspace: w, selected, loading, onSelect }: WorkspacePickerItemProps) {
  const id = w.workspaceId ?? w.id ?? ''
  return (
    <li>
      <span>{w.label ?? id}</span>
      <span>{id}</span>
      {w.focused ? <span>{r.workspaceFocused}</span> : null}
      {typeof w.paneCount === 'number' ? <span>{r.panesTitle}: {w.paneCount}</span> : null}
      {selected ? <span aria-current="true">{r.workspaceSelected}</span> : (
        <Button type="button" onClick={() => void onSelect(id)} disabled={loading}>
          {r.workspaceSelect}
        </Button>
      )}
    </li>
  )
}
export default WorkspacePickerItem
