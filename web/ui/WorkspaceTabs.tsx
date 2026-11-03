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
 return <section className="workspace-switcher" aria-label={r.workspacesTitle} aria-busy={busy}>
  {notice && <p role="alert" className="workspace-switcher-notice">{notice}</p>}
  <AsyncList state={state} rows={1} refreshing={false} empty={<p>{r.workspacesEmpty}</p>}
   errorText={r.workspacesError} onRetry={onRetry}>
   {items => <WorkspaceTabsList items={items} current={current} busy={busy} target={target}
    onSelect={onSelect}/>}
  </AsyncList>
 </section>
}
