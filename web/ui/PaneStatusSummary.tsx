import type { PaneSummary } from '../domain/timeline'
import type { AsyncState } from '../domain/asyncState'
import { summarizePaneStatuses } from '../domain/paneStatusSummary'
import { PaneStatusSummaryItem } from './PaneStatusSummaryItem'
import r from '../resources.json'
type P = { panes: PaneSummary[]; state?: AsyncState<PaneSummary[]> }
const known = ['idle', 'working', 'done', 'blocked'] as const
export function PaneStatusSummary({ panes, state }: P) {
  if (!state || state.status === 'loading') return null
  if (state.status === 'error') return <p role="alert">{r.panesError}</p>
  const x = summarizePaneStatuses(panes)
  return (
    <section aria-label={r.statusSummaryAria} className="flex flex-wrap gap-2 text-sm">
      {known.map((s) => <PaneStatusSummaryItem key={s} status={s} count={x[s]} />)}
      {x.unknown > 0 && <PaneStatusSummaryItem status="unknown" count={x.unknown} />}
    </section>
  )
}
