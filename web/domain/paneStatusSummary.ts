import type { PaneSummary } from './timeline'
import type { PaneStatusSummary } from './paneStatusSummary.types'
export type { PaneStatusSummary } from './paneStatusSummary.types'
const KNOWN = new Set(['idle', 'working', 'done', 'blocked'])
export function summarizePaneStatuses(p: readonly PaneSummary[] | null | undefined): PaneStatusSummary {
  const o: PaneStatusSummary = { idle: 0, working: 0, done: 0, blocked: 0, unknown: 0, total: 0 }
  const seen = new Set<string>()
  for (const x of p ?? []) {
    if (!x || typeof x.paneId !== 'string' || seen.has(x.paneId)) continue
    seen.add(x.paneId); o.total++
    const st = x.status
    if (typeof st === 'string' && KNOWN.has(st)) (o as unknown as Record<string, number>)[st]++
    else o.unknown++
  }
  return o
}