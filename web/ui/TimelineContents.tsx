import type { TimelineSectionProps } from './dashboardTypes'
import { TimelineView } from './TimelineView'
import r from '../resources.json'

type P = Pick<TimelineSectionProps, 'target' | 'timeline' | 'state' | 'onRetry' | 'onCancel' | 'onLoadOlder' | 'olderLoaded' | 'onReachBottom'>
export function TimelineContents({target, timeline, state, onRetry, onCancel, onLoadOlder, olderLoaded, onReachBottom}: P) {
 return target
  ? <TimelineView items={timeline} state={state} onRetry={onRetry} onCancel={onCancel} onLoadOlder={onLoadOlder} olderLoaded={olderLoaded} onReachBottom={onReachBottom}/>
  : <p>{r.selectTarget}</p>
}
