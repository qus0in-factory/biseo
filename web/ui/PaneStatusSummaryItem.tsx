import type { PaneStatus } from '../domain/timeline'
import r from '../resources.json'
import { statusAccentColor } from './paneStatusBadgeStyle'

export function PaneStatusSummaryItem({ status, count }: { status: PaneStatus; count: number }) {
  const key = status === 'unknown' ? 'statusSummaryUnknown' : `status_${status}`
  const label = (r as Record<string, string>)[key] ?? status
  return (
    <span className="font-semibold" style={{ color: statusAccentColor(status) }}>
      {label} {count}
    </span>
  )
}
