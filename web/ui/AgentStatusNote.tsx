import type { TurnStatus } from '../domain/timeline'
import r from '../resources.json'

export function AgentStatusNote({ status, errorCode }: { status: TurnStatus; errorCode?: string | null }) {
  if (status === 'timeout' && errorCode === 'late_capture_expired') {
    return (
      <>
        <p className="mt-1 text-[0.8125rem] text-muted-foreground">{r.lateCaptureClosed}</p>
        <p className="mt-1 text-xs text-muted-foreground">{r.timeoutExpiredHint}</p>
      </>
    )
  }
  if (status === 'timeout') {
    return (
      <>
        <p className="mt-1 text-[0.8125rem] text-muted-foreground">{r.collectingLate}</p>
        <p className="mt-1 text-xs text-muted-foreground">{r.timeoutRetryHint}</p>
      </>
    )
  }
  if (status === 'capture_unavailable') return <p className="text-error">{r.captureUnavailable}</p>
  if (status === 'working') return <p className="text-sm text-muted-foreground">{r.spinner}</p>
  return null
}
