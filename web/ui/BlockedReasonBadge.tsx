import { Clock, HelpCircle, ShieldAlert } from 'lucide-react'
import type { PaneSummary } from '../domain/timeline'
import { getBlockedReasonText } from '../domain/blockedReason'
import { HintPopover } from './HintPopover'

export function BlockedReasonBadge({ item }: { item: PaneSummary }) {
  const reason = item.blockedReason
  if (!reason) return null
  const text = getBlockedReasonText(reason, item.availability?.resetsAt, item.usageLimitSuspected)
  if (!text) return null

  const Icon = reason === 'usage_limit' ? ShieldAlert : reason === 'input_request' ? Clock : HelpCircle

  return (
    <HintPopover label={text} className={`pane-blocked-reason reason-${reason}`}>
      <span role="status" className="inline-flex shrink-0 items-center">
        <Icon size={13} aria-hidden="true" />
      </span>
    </HintPopover>
  )
}
