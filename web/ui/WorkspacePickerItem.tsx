import { Button } from '../components/ui/button'
import type { WorkspaceSummary } from '../domain/ports'
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
      {w.focused ? <span>focused</span> : null}
      {typeof w.paneCount === 'number' ? <span>{w.paneCount} panes</span> : null}
      {selected ? <span>selected</span> : (
        <Button type="button" onClick={() => void onSelect(id)} disabled={loading}>
          Select
        </Button>
      )}
    </li>
  )
}
export default WorkspacePickerItem