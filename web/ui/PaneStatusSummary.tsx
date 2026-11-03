import type { PaneSummary } from '../domain/timeline'
import type { AsyncState } from '../domain/asyncState'
import { summarizePaneStatuses } from '../domain/paneStatusSummary'
import { PaneStatusSummaryItem } from './PaneStatusSummaryItem'
import r from '../resources.json'
type P = { panes: PaneSummary[]; state?: AsyncState<PaneSummary[]> }
const known = ['idle', 'working', 'done', 'input_required', 'blocked', 'unknown'] as const
export function PaneStatusSummary({ panes, state }: P) {
  if (!state || state.status === 'loading') return null
  if (state.status === 'error') return <p role="alert">{r.panesError}</p>
  const x = summarizePaneStatuses(panes)
  return (
    <section aria-label={r.statusSummaryAria}>
      <span className="sr-only">{known.map((s) => <PaneStatusSummaryItem key={s} status={s} count={x[s]} />)}</span>
      <div aria-hidden="true" className="flex flex-wrap gap-2 text-sm md:flex-nowrap md:gap-1 md:text-xs [&>span]:whitespace-nowrap">
        {known.filter((s) => x[s] > 0).map((s) => <PaneStatusSummaryItem key={s} status={s} count={x[s]} />)}
      </div>
    </section>
  )
}
