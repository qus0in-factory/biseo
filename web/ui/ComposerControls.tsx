import type { PaneSummary } from '../domain/timeline'
import { getPaneState, isQueuedTarget } from '../domain/paneState'
import { SendIcon, ReasonIcon } from './ComposerIcons'
import { InterruptButton } from './InterruptButton'
import r from '../resources.json'

const res = r as Record<string, string>

type P = { target?: PaneSummary; busy: boolean; can: boolean; online?: boolean }

export function ComposerControls({ target, busy, can, online }: P) {
  const { reason } = getPaneState(target)
  const err = reason ? res[reason] ?? reason : null
  const lbl = busy ? res.sending : isQueuedTarget(target) ? (res.reserveSend ?? res.send) : res.send

  return (
    <div className="composer-actions">
      <InterruptButton target={target} online={online} />
      {err && <ReasonIcon title={err} />}
      <button className="btn-send-round" type="submit" disabled={!can} aria-label={lbl} title={lbl}>
        <SendIcon />
      </button>
    </div>
  )
}
