import type { PaneSummary } from '../domain/timeline'
import { useInterrupt } from '../app/useInterrupt'
import r from '../resources.json'
import '../interrupt.css'

type P = { target?: PaneSummary; online?: boolean; conf?: (m: string) => boolean }

export function InterruptButton({ target, online = true, conf }: P) {
  const { can, tip, msg, run, visible } = useInterrupt(target, online, conf)
  if (!visible) return null

  return (
    <div className="interrupt-wrap">
      <button
        type="button"
        className="btn-interrupt"
        disabled={!can}
        onClick={run}
        title={tip}
        aria-label={r.unblockEsc}
      >
        {r.unblockEsc}
      </button>
      {msg && <span className="interrupt-msg" role="status">{msg}</span>}
    </div>
  )
}
