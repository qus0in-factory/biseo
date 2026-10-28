import type { TimelineItem } from '../domain/timeline'
import r from '../resources.json'

type P = Record<string, string>
const res = r as P

export function TimelineItemView({ item }: { item: TimelineItem }) {
  const isWorking = item.status === 'queued' || item.status === 'working'
  const isUnavailable = item.status === 'capture_unavailable'
  const st = res[`turn_${item.status}`] ?? item.status
  return (
    <article className="timeline-item">
      <div>
        <strong>{item.targetName}</strong> <small>({item.paneId})</small>{' '}
        <span className="pane-badge">{st}</span>
      </div>
      <p>{item.promptText}</p>
      {isWorking && <p className="spinner">{res.spinner}</p>}
      {isUnavailable && <p className="err">{res.captureUnavailable}</p>}
      {item.responseText && (
        <pre className="timeline-response">{item.responseText}</pre>
      )}
      {item.errorCode && <small className="err">{item.errorCode}</small>}
    </article>
  )
}
