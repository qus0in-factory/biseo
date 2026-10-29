import { Clock, Loader2, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react'
import type { PaneStatus } from '../domain/timeline'
import r from '../resources.json'

const res = r as Record<string, string>

const icons: Record<PaneStatus, typeof Clock> = {
  idle: Clock,
  working: Loader2,
  done: CheckCircle2,
  blocked: AlertTriangle,
  unknown: HelpCircle,
}

export function PaneStatusBadge({ status }: { status: PaneStatus }) {
  const Icon = icons[status] ?? HelpCircle
  const label = res[`status_${status}`] ?? status
  const spin = status === 'working' ? 'spin' : ''

  return (
    <span className={`pane-badge status-${status}`} aria-label={label} role="status">
      <Icon size={14} className={spin} aria-hidden="true" />
      <span>{label}</span>
    </span>
  )
}
