import type { PaneSummary } from '../domain/timeline'
import { ComposerControls } from './ComposerControls'
import { ComposerCapsule } from './ComposerCapsule'
import { ComposerField } from './ComposerField'
import { ComposerShell } from './ComposerShell'
import { useComposer } from './useComposer'
import { useVisualViewportBind } from '../app/useVisualViewportBind.js'
import r from '../resources.json'

export function MessageComposer({ target, busy, onSend }: { target?: PaneSummary; busy: boolean; onSend: (t: string) => void }) {
  useVisualViewportBind()
  const { t, setT, ref, canSend, submit, onKey } = useComposer(target, busy, onSend)
  const ph = target ? r.messageTo.replace('{name}', target.name) : r.selectTarget
  return <ComposerShell onSubmit={(e) => { e.preventDefault(); submit() }}><ComposerCapsule><ComposerField inputRef={ref} value={t} onChange={setT} onKey={onKey} placeholder={ph} /><ComposerControls target={target} busy={busy} can={canSend} /></ComposerCapsule></ComposerShell>
}
