import { useState } from 'react'
import type { PaneSummary } from '../domain/timeline'
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
  const canSend = Boolean(target?.sendable) && !busy && t.trim().length > 0

  return (
    <form
      className="composer"
      onSubmit={(e) => {
        e.preventDefault()
        if (canSend) {
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
      />
      <ComposerControls target={target} busy={busy} can={canSend} />
    </form>
  )
}
