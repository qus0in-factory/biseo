import { Clock, Loader2, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react'
import type { PaneStatus } from '../domain/timeline'
import { Badge } from '../components/ui/badge'
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
  const spin = status === 'working' ? 'motion-safe:animate-spin' : ''

  return (
    <Badge variant="outline" aria-label={label} role="status" className="min-w-0 max-w-[50%] flex-shrink overflow-hidden text-ellipsis">
      <Icon size={14} className={spin} aria-hidden="true" />
      <span className="overflow-hidden text-ellipsis">{label}</span>
    </Badge>
  )
}
