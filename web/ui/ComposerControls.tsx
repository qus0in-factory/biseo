import type { PaneSummary } from '../domain/timeline'
import { getPaneState } from '../domain/paneState'
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
  return (
    <div>
      <button className="btn" type="submit" disabled={!can}>
        {busy ? res.sending : res.send}
      </button>
      {err && <span className="err"> ({err})</span>}
    </div>
  )
}
