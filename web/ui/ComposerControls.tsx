import type { PaneSummary } from '../domain/timeline'
import { getPaneState, isQueuedTarget } from '../domain/paneState'
import { ReasonTip } from './ReasonTip'
import { SendRoundButton } from './SendRoundButton'
import r from '../resources.json'

type P = Record<string, string>
const res = r as P

export function ComposerControls({
  target,
  busy,
  can,
}: {
  target?: PaneSummary
  busy: boolean
  can: boolean
}) {
  const { reason } = getPaneState(target)
  const err = reason ? res[reason] ?? reason : null
  const label = busy
    ? res.sending
    : isQueuedTarget(target)
      ? (res.reserveSend ?? res.send)
      : res.send

  return (
    <div className="flex shrink-0 items-end gap-1.5 self-end">
      {err && <ReasonTip text={err} />}
      <SendRoundButton label={label} can={can} />
    </div>
  )
}
