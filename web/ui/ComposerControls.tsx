import type { PaneSummary } from '../domain/timeline'
import { getPaneState, isQueuedTarget } from '../domain/paneState'
import { ReasonTip } from './ReasonTip'
import { SendRoundButton } from './SendRoundButton'
import { InterruptButton } from './InterruptButton'
import r from '../resources.json'

const res = r as Record<string, string>

type P = { target?: PaneSummary; busy: boolean; can: boolean; online?: boolean }

export function ComposerControls({ target, busy, can, online }: P) {
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
      <SendRoundButton label={label} can={can} />
    </div>
  )
}
