import type { TurnStatus } from '../domain/timeline'
import r from '../resources.json'

export function AgentResult({ status, responseText }: { status: TurnStatus; responseText?: string | null }) {
  return (
    <>
      {status === 'working' && <p className="text-sm text-muted-foreground">{r.spinner}</p>}
      {status === 'capture_unavailable' && (
        <p className="text-error">{r.captureUnavailable}</p>
      )}
      {status === 'timeout' && (
        <p className="mt-1 text-[0.8125rem] text-muted-foreground">{r.collectingLate}</p>
      )}
      {responseText && <pre className="mt-2 border-l-[3px] border-l-primary bg-surface p-2 font-mono whitespace-pre-wrap break-words">{responseText}</pre>}
    </>
  )
}
