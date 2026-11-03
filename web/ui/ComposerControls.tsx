import type { PaneSummary } from '../domain/timeline'
import { isQueuedTarget } from '../domain/paneState'
import { RecentPullButton } from './RecentPullButton'
import { SendRoundButton } from './SendRoundButton'
import { ComposerStatus } from './ComposerStatus'
import type { RecentPull } from './useRecentPull'
import r from '../resources.json'

const res = r as Record<string, string>

type P = { target?: PaneSummary; busy: boolean; can: boolean; online?: boolean; pull?: RecentPull }

export function ComposerControls({ target, busy, can, online, pull }: P) {
  const label = busy
    ? res.sending
    : isQueuedTarget(target)
      ? (res.reserveSend ?? res.send)
      : res.send
  return (
    <div className="contents md:flex md:shrink-0 md:items-center md:gap-1.5 md:self-end">
      <ComposerStatus target={target} online={online} />
      <div className="flex shrink-0 items-center gap-1.5 self-end">
        {pull && <RecentPullButton pull={pull} />}
        <SendRoundButton label={label} can={can} />
      </div>
    </div>
  )
}
