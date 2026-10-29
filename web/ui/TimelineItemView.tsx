import type { TimelineItem } from '../domain/timeline'
import { TimelineItemHeader } from './TimelineItemHeader'
import { TurnErrorDetails } from './TurnErrorDetails'
import r from '../resources.json'

export function TimelineItemView({
  item,
  onCancel,
}: {
  item: TimelineItem
  onCancel?: (id: string) => void
}) {
  const isWorking = item.status === 'working'
  const isUnavailable = item.status === 'capture_unavailable'
  const isTimeout = item.status === 'timeout'

  return (
    <article className="timeline-item">
      <TimelineItemHeader item={item} onCancel={onCancel} />
      <p>{item.promptText}</p>
      {isWorking && <p className="spinner">{r.spinner}</p>}
      {isUnavailable && <p className="err">{r.captureUnavailable}</p>}
      {isTimeout && <p className="late-collect">{r.collectingLate}</p>}
      {item.responseText && (
        <pre className="timeline-response">{item.responseText}</pre>
      )}
      <TurnErrorDetails code={item.errorCode} />
    </article>
  )
}
