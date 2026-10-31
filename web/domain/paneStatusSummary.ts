import type { PaneSummary } from './timeline'
import type { PaneStatusSummary } from './paneStatusSummary.types'
export type { PaneStatusSummary, PaneStatusCounts, StatusSummary, PaneStatusCount, StatusCounts } from './paneStatusSummary.types'
const K = new Set(['idle', 'working', 'done', 'blocked'])
export function summarizePaneStatuses(p: readonly PaneSummary[] | null | undefined): PaneStatusSummary {
  const o = { idle: 0, working: 0, done: 0, blocked: 0, unknown: 0, total: 0 }
  const s = new Set<string>()
  for (const x of p ?? []) {
    if (!x || typeof x.paneId !== 'string' || s.has(x.paneId)) continue
    s.add(x.paneId); o.total++
    const st = x.status
    if (typeof st === 'string' && K.has(st)) {
      if (st === 'idle') o.idle++
      else if (st === 'working') o.working++
      else if (st === 'done') o.done++
      else if (st === 'blocked') o.blocked++
    } else o.unknown++
  }
  return o
}
export const countPaneStatuses = summarizePaneStatuses
