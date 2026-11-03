import type { AsyncState } from '../domain/asyncState'
import type { WorkspaceSummary } from '../domain/ports'
import { AsyncList } from './AsyncList'
import { WorkspaceTabsList } from './WorkspaceTabsList'
import r from '../resources.json'

type P = {
 state: AsyncState<WorkspaceSummary[]>
 current: string | null
 notice: string | null
 busy: boolean
 target: string | null
 onSelect: (id: string) => void
 onRetry: () => void
}

export function WorkspaceTabs({ state, current, notice, busy, target, onSelect, onRetry }: P) {
 const label = current ? r.workspaceCurrent.replace('{id}', current) : r.workspaceCurrentUnknown
 return <section className="workspace-switcher" aria-busy={busy}>
  <span className="workspace-switcher-label" title={label}>{label}</span>
  {notice && <p role="alert" className="workspace-switcher-notice">{notice}</p>}
  <AsyncList state={state} rows={1} refreshing={false} empty={<p>{r.workspacesEmpty}</p>}
   errorText={r.workspacesError} onRetry={onRetry}>
   {items => <WorkspaceTabsList items={items} current={current} busy={busy} target={target}
    onSelect={onSelect}/>}
  </AsyncList>
 </section>
}
