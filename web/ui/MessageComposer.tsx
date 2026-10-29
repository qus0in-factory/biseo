import type { PaneSummary } from '../domain/timeline'
import { useVisualViewportBind } from '../app/useVisualViewportBind.js'
import { ComposerBody } from './ComposerBody'
import r from '../resources.json'

type P = { target?: PaneSummary; busy: boolean; onSend: (s: string) => void; online?: boolean }

export function MessageComposer({ target, busy, onSend, online }: P) {
  useVisualViewportBind()
  const ph = target ? r.messageTo.replace('{name}', target.name) : r.selectTarget
  return <ComposerBody target={target} busy={busy} onSend={onSend} online={online} placeholder={ph} />
}
