import type { PaneSummary } from '../domain/timeline'
import { ComposerControls } from './ComposerControls'
import { useComposer } from './useComposer'
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
  const { t, setT, ref, canSend, submit, onKey } = useComposer(
    target,
    busy,
    onSend,
  )
  const ph = target ? r.messageTo.replace('{name}', target.name) : r.selectTarget

  return (
    <form
      className="composer"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <div className="composer-box">
        <textarea
          ref={ref}
          className="composer-input"
          rows={1}
          value={t}
          placeholder={ph}
          onChange={(e) => setT(e.target.value)}
          onKeyDown={onKey}
        />
        <ComposerControls target={target} busy={busy} can={canSend} />
      </div>
    </form>
  )
}
