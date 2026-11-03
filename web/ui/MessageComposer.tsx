import type { PaneSummary, TimelineItem } from '../domain/timeline'
import { useVisualViewportBind } from '../app/useVisualViewportBind.js'
import { hasCollectingTimeout } from '../domain/collectingTimeout'
import { ComposerBody } from './ComposerBody'
import { RecentPullStatus } from './RecentPullStatus'
import type { RecentPull } from './useRecentPull'
import r from '../resources.json'

type P = {
  target?: PaneSummary
  busy: boolean
  onSend: (s: string) => void
  online?: boolean
  timeline?: TimelineItem[]
  pull: RecentPull
}

export function MessageComposer({ target, busy, onSend, online, timeline = [], pull }: P) {
  useVisualViewportBind()
  const hold = target?.status === 'working' && hasCollectingTimeout(timeline)
  const ph = target ? r.messageTo.replace('{name}', target.name) : r.selectTarget
  return (
    <>
      {hold && <p className="pb-1 text-xs text-muted-foreground">{r.holdCollecting}</p>}
      {target && <RecentPullStatus pull={pull} />}
      <ComposerBody target={target} busy={busy} onSend={onSend} online={online} placeholder={ph} hold={hold} pull={target ? pull : undefined} />
    </>
  )
}
