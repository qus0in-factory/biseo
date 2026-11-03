import { Clock, Loader2, CheckCircle2, AlertTriangle, HelpCircle, MessageCircleQuestion } from 'lucide-react'
import type { PaneStatus, BlockedReason } from '../domain/timeline'
import { inputStatus, type DisplayStatus } from '../domain/inputStatus'
import r from '../resources.json'
import { StatusBadge } from './StatusBadge'
import { HintPopover } from './HintPopover'
const icons: Record<DisplayStatus, typeof Clock> = { idle: Clock, working: Loader2, done: CheckCircle2, blocked: AlertTriangle, unknown: HelpCircle, input_required: MessageCircleQuestion }
export function PaneStatusBadge({ status: raw, blockedReason }: { status: PaneStatus; blockedReason?: BlockedReason }) {
  const status = inputStatus(raw, blockedReason)
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
