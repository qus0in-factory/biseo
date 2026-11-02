import { Clock, Loader2, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react'
import type { PaneStatus } from '../domain/timeline'
import r from '../resources.json'
import { StatusBadge } from './StatusBadge'
import { HintPopover } from './HintPopover'
const icons: Record<PaneStatus, typeof Clock> = { idle: Clock, working: Loader2, done: CheckCircle2, blocked: AlertTriangle, unknown: HelpCircle }
export function PaneStatusBadge({ status }: { status: PaneStatus }) {
  const Icon = icons[status]
  const label = (r as Record<string, string>)[`status_${status}`] ?? status
  return (
    <HintPopover label={label} className="max-w-[50%]"><StatusBadge
      status={status}
      label={label}
      icon={Icon}
      spin={status === 'working'}
      className="overflow-hidden text-ellipsis"
    /></HintPopover>
  )
}
