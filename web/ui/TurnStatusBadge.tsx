import { Clock, Loader2, CheckCircle2, Info, AlertTriangle, XCircle, Timer, Ban } from 'lucide-react'
import type { TurnStatus } from '../domain/timeline'
import { turnStatusLabel } from './turnStatusLabel'
import { turnStatusTone } from './turnStatusTone'
import { StatusBadge } from './StatusBadge'
import r from '../resources.json'

const res = r as Record<string, string>
const icons: Record<TurnStatus, typeof Clock> = { queued: Clock, working: Loader2, completed: CheckCircle2, capture_unavailable: Info, blocked: AlertTriangle, failed: XCircle, timeout: Timer, cancelled: Ban }

export function TurnStatusBadge({ status, errorCode }: { status: TurnStatus; errorCode?: string | null }) {
  const Icon = icons[status] ?? Info
  const label = turnStatusLabel(status, errorCode, res)
  return (
    <StatusBadge
      status={turnStatusTone(status)}
      label={label}
      icon={Icon}
      spin={status === 'working'}
    />
  )
}
