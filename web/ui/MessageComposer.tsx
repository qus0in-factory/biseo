import { useState } from 'react'
import type { PaneSummary } from '../domain/timeline'
import { getPaneState } from '../domain/paneState'
import { ComposerControls } from './ComposerControls'
import r from '../resources.json'

export function MessageComposer({
  target,
  busy,
  onSend,
}: {
  target?: PaneSummary
  busy: boolean
  onSend: (text: string) => void
}) {
  const [t, setT] = useState('')
  const { ok } = getPaneState(target)
  const can = ok && t.trim().length > 0 && !busy

  return (
    <form
      className="composer"
      onSubmit={(e) => {
        e.preventDefault()
        if (can) {
          onSend(t)
          setT('')
        }
      }}
    >
      <textarea
        className="composer-input"
        rows={3}
        value={t}
        placeholder={target ? r.messagePlaceholder : r.selectTarget}
        onChange={(e) => setT(e.target.value)}
        disabled={!ok || busy}
      />
      <ComposerControls target={target} busy={busy} can={can} />
    </form>
  )
}
