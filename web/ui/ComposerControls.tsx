import type { PaneSummary } from '../domain/timeline'
import { getPaneState, isQueuedTarget } from '../domain/paneState'
import { ReasonTip } from './ReasonTip'
import { RecentPullButton } from './RecentPullButton'
import { SendRoundButton } from './SendRoundButton'
import { InterruptButton } from './InterruptButton'
import type { RecentPull } from './useRecentPull'
import r from '../resources.json'

const res = r as Record<string, string>

type P = { target?: PaneSummary; busy: boolean; can: boolean; online?: boolean; pull?: RecentPull }

export function ComposerControls({ target, busy, can, online, pull }: P) {
  const { reason } = getPaneState(target)
  const err = reason ? res[reason] ?? reason : null
  const label = busy
    ? res.sending
    : isQueuedTarget(target)
      ? (res.reserveSend ?? res.send)
      : res.send
  return (
    <div className="flex shrink-0 items-end gap-1.5 self-end">
      <InterruptButton key={target?.paneId ?? 'none'} target={target} online={online} />
      {err && <ReasonTip text={err} />}
      {pull && <RecentPullButton pull={pull} />}
      <SendRoundButton label={label} can={can} />
    </div>
  )
}
