import type { TurnStatus } from '../domain/timeline'
import { AgentStatusNote } from './AgentStatusNote'
import { MarkdownResponse } from './MarkdownResponse.js'

export function AgentResult({
  status,
  responseText,
  errorCode,
}: {
  status: TurnStatus
  responseText?: string | null
  errorCode?: string | null
}) {
  return (
    <>
      <AgentStatusNote status={status} errorCode={errorCode} />
      {responseText && status === 'completed' && <MarkdownResponse text={responseText} />}
      {responseText && status !== 'completed' && (
        <pre className="mt-2 border-l-[3px] border-l-primary bg-surface p-2 font-mono whitespace-pre-wrap break-words">{responseText}</pre>
      )}
    </>
  )
}
