import type { TimelineItem } from '../domain/timeline'
import { AgentHeader } from './AgentHeader'
import { TurnErrorDetails } from './TurnErrorDetails'
import r from '../resources.json'

export function AgentBubble({
  item,
  onCancel,
}: {
  item: TimelineItem
  onCancel?: (id: string) => void
}) {
  const { status, responseText, errorCode, cancelError } = item
  return (
    <div className="chat-bubble chat-bubble-agent">
      <AgentHeader item={item} onCancel={onCancel} />
      {status === 'working' && <p className="spinner">{r.spinner}</p>}
      {status === 'capture_unavailable' && (
        <p className="err">{r.captureUnavailable}</p>
      )}
      {status === 'timeout' && (
        <p className="late-collect">{r.collectingLate}</p>
      )}
      {responseText && <pre className="timeline-response">{responseText}</pre>}
      <TurnErrorDetails code={errorCode} />
      {cancelError && <span className="err">({cancelError})</span>}
    </div>
  )
}
