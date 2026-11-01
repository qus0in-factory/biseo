import type { WorkspacePickerViewProps } from './WorkspacePickerView'
import type { WorkspaceSummary } from '../domain/ports'
import { WorkspacePickerItem } from './WorkspacePickerItem'

export function WorkspacePickerList({ items, ...p }: WorkspacePickerViewProps & { items: WorkspaceSummary[] }) {
 return <ul>{items.map(workspace => <WorkspacePickerItem key={workspace.workspaceId ?? workspace.id}
  workspace={workspace} selected={(workspace.workspaceId ?? workspace.id) === p.current}
  loading={p.loading} onSelect={p.onSelect}/>)}</ul>
}
