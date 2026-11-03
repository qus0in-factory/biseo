import type { TimelineSectionProps } from './dashboardTypes'
import { TimelineView } from './TimelineView'
import r from '../resources.json'

type P = Pick<TimelineSectionProps, 'target' | 'timeline' | 'state' | 'onRetry' | 'onCancel' | 'onLoadOlder' | 'olderLoaded'>
export function TimelineContents({target, timeline, state, onRetry, onCancel, onLoadOlder, olderLoaded}: P) {
 return target
  ? <TimelineView key={target.paneId} items={timeline} state={state} onRetry={onRetry} onCancel={onCancel} onLoadOlder={onLoadOlder} olderLoaded={olderLoaded}/>
  : <p>{r.selectTarget}</p>
}
