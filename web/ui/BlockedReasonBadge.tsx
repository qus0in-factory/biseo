import { Clock, HelpCircle, ShieldAlert } from 'lucide-react'
import type { PaneSummary } from '../domain/timeline'
import { getBlockedReasonText } from '../domain/blockedReason'

export function BlockedReasonBadge({ item }: { item: PaneSummary }) {
  const r = item.blockedReason
  if (!r) return null
  const text = getBlockedReasonText(r, item.availability?.resetsAt)
  if (!text) return null

  const Icon = r === 'usage_limited' ? ShieldAlert : r === 'awaiting_input' ? Clock : HelpCircle

  return (
    <span
      className={`pane-blocked-reason reason-${r}`}
      title={text}
      aria-label={text}
      role="status"
    >
      <Icon size={13} aria-hidden="true" />
    </span>
  )
}
