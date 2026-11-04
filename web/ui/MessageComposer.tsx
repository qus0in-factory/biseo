import type { PaneSummary } from '../domain/timeline'
import { useVisualViewportBind } from '../app/useVisualViewportBind.js'
import { ComposerBody } from './ComposerBody'
import { RecentPullStatus } from './RecentPullStatus'
import type { RecentPull } from './useRecentPull'
import r from '../resources.json'

type P = {
  target?: PaneSummary
  busy: boolean
  onSend: (s: string) => void
  online?: boolean
  pull: RecentPull
}

export function MessageComposer({ target, busy, onSend, online, pull }: P) {
  useVisualViewportBind()
  const ph = target ? r.messageTo.replace('{name}', target.name) : r.selectTarget
  return (
    <>
      {target && <RecentPullStatus pull={pull} />}
      <ComposerBody target={target} busy={busy} onSend={onSend} online={online} placeholder={ph} pull={target ? pull : undefined} />
    </>
  )
}
