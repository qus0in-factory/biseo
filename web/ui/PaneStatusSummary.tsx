import type { PaneSummary } from '../domain/timeline'
import type { AsyncState } from '../domain/asyncState'
import { summarizePaneStatuses as s } from '../domain/paneStatusSummary'
import r from '../resources.json'
type P = { panes: PaneSummary[]; state?: AsyncState<PaneSummary[]> }
export function PaneStatusSummary({ panes, state }: P) {
  if (!state || state.status === 'loading') return <p role="status">{r.loading}</p>
  if (state.status === 'error') return <p role="alert">{r.panesError}</p>
  const x = s(panes)
  return (
    <section aria-label={r.statusSummaryAria} className="flex flex-wrap gap-2 text-sm">
      <span>{r.status_idle} {x.idle}</span>
      <span>{r.status_working} {x.working}</span>
      <span>{r.status_done} {x.done}</span>
      <span>{r.status_blocked} {x.blocked}</span>
      {x.unknown > 0 && <span>{r.statusSummaryUnknown} {x.unknown}</span>}
    </section>
  )
}
