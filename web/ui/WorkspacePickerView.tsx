import type { WorkspaceSummary } from '../domain/ports'
import type { AsyncState } from '../domain/asyncState'
import { WorkspacePickerList } from './WorkspacePickerList'
import { AsyncList } from './AsyncList'
import r from '../resources.json'
export interface WorkspacePickerViewProps {
 state: AsyncState<WorkspaceSummary[]>
 current: string | null
 loading: boolean
 notice: string | null
 onSelect: (id: string) => void
 onRetry: () => void
}
export function WorkspacePickerView(p: WorkspacePickerViewProps) {
 return <section aria-label={r.workspacesTitle}>
  <h2>{r.workspacesTitle}</h2>
  {p.notice && <p role="alert">{p.notice}</p>}
  <AsyncList state={p.state} empty={<p>{r.workspacesEmpty}</p>} errorText={r.workspacesError} onRetry={p.onRetry}>
   {items=><WorkspacePickerList {...p} items={items}/>}
  </AsyncList>
 </section>
}
