import type { WorkspaceApiPort as P } from '../domain/ports'
import type { PaneSummary as S, TimelineItem as I } from '../domain/timeline'
import { mergeTurn } from '../domain/mergeTurn'
import { markFailed } from '../domain/markFailed'
import { canInputTarget } from '../domain/paneState'
import { prepareTurn, submitTurn } from '../domain/sendTurn'

type SetItems = React.Dispatch<React.SetStateAction<I[]>>

export async function executeSend(
  p: P,
  w: string | null,
  t: S | undefined,
  text: string,
  set: SetItems,
  setBusy: (b: boolean) => void,
  current: () => boolean = () => true,
) {
  const s = text.trim()
  if (!w || !t || !canInputTarget(t) || !s) return
  setBusy(true)
  const { item, input } = prepareTurn(w, t, s)
  set((m) => mergeTurn(m, item))
  try {
    await submitTurn(p, input)
  } catch {
    if (!current()) return
    set((m) => markFailed(m, input.requestId))
    try {
      const turn = await p.getTurn(input.requestId)
      if (current()) set((m) => mergeTurn(m, turn))
    } catch {}
  } finally {
    if (current()) setBusy(false)
  }
}
