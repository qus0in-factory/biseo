import type { PaneSummary } from '../domain/timeline'
import { getPaneState } from '../domain/paneState'
import { SendIcon, ReasonIcon } from './ComposerIcons'
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
  const btnLabel = busy ? res.sending : res.send

  return (
    <div className="composer-actions">
      {err && <ReasonIcon title={err} />}
      <button
        className="btn-send-round"
        type="submit"
        disabled={!can}
        aria-label={btnLabel}
        title={btnLabel}
      >
        <SendIcon />
      </button>
    </div>
  )
}
