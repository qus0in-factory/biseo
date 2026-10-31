import { SettingsAction } from './SettingsAction'
import { Check } from 'lucide-react'
import type { WorkspaceSummary } from '../domain/ports'
import r from '../resources.json'
interface Props {
  workspace: WorkspaceSummary
  selected: boolean
  loading: boolean
  onSelect: (id: string) => void
}
export function WorkspacePickerItem({ workspace: w, selected, loading, onSelect }: Props) {
  const id = w.workspaceId ?? w.id ?? ''
  return (
    <li className={selected ? 'bg-muted ring-2 ring-ring' : undefined}>
      <span>{w.label ?? id}</span>
      <span>{id}</span>
      {w.focused ? <span>{r.workspaceFocused}</span> : null}
      {typeof w.paneCount === 'number' ? <span>{r.panesTitle}: {w.paneCount}</span> : null}
      {selected ? <span aria-current="true">{r.workspaceSelected}</span> : (
        <SettingsAction icon={Check} type="button" onClick={() => void onSelect(id)} busy={loading}>
          {r.workspaceSelect}
        </SettingsAction>
      )}
    </li>
  )
}
