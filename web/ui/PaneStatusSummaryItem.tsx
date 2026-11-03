import type { DisplayStatus as PaneStatus } from '../domain/inputStatus'
import r from '../resources.json'
import { statusAccentColor } from './paneStatusBadgeStyle'

export function PaneStatusSummaryItem({ status, count }: { status: PaneStatus; count: number }) {
  const key = status === 'unknown' ? 'statusSummaryUnknown' : `status_${status}`
  const label = (r as Record<string, string>)[key] ?? status
  return (
    <span className={status === 'input_required' ? 'font-semibold text-warning' : 'font-semibold'}
      style={status === 'input_required' ? undefined : { color: statusAccentColor(status) }}>
      {label} {count}
    </span>
  )
}
