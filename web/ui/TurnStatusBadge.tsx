import {
  Clock,
  Loader2,
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
  Timer,
  Ban,
} from 'lucide-react'
import type { TurnStatus } from '../domain/timeline'
import r from '../resources.json'

const res = r as Record<string, string>

const icons: Record<TurnStatus, typeof Clock> = {
  queued: Clock,
  working: Loader2,
  completed: CheckCircle2,
  capture_unavailable: Info,
  blocked: AlertTriangle,
  failed: XCircle,
  timeout: Timer,
  cancelled: Ban,
}

export function TurnStatusBadge({ status }: { status: TurnStatus }) {
  const Icon = icons[status] ?? Info
  const label = res[`turn_${status}`] ?? status
  const spin = status === 'working' ? 'spin' : ''

  return (
    <span className={`pane-badge turn-${status}`} aria-label={label} role="status">
      <Icon size={14} className={spin} aria-hidden="true" />
      <span>{label}</span>
    </span>
  )
}
