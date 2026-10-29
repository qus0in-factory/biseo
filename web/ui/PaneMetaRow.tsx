import { ReasonDetails } from './ReasonDetails'
import r from '../resources.json'

const res = r as Record<string, string>

export function PaneMetaRow({ agentKind, disabledReason }: { agentKind?: string | null; disabledReason?: string | null }) {
  const reason = disabledReason ? `${res.reasonPrefix}${res[disabledReason] ?? disabledReason}` : null
  return (
    <span className="flex w-full items-center justify-start gap-1.5">
      <small className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground">{agentKind ?? ''}</small>
      {reason && <ReasonDetails text={reason} />}
    </span>
  )
}
