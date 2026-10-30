import type { WorkspaceApiPort as P } from '../domain/ports'
import type { TimelineItem as I } from '../domain/timeline'
import { markCancelled } from '../domain/markCancelled'
import { mergeTurn } from '../domain/mergeTurn'
import r from '../resources.json'

type SetItems = React.Dispatch<React.SetStateAction<I[]>>
const statusOf = (e: unknown) => (e as { response?: { status?: number } })?.response?.status

const getCancelError = (e: unknown) => statusOf(e) === 409 ? r.cancelConflict : r.cancelFailed

export async function executeCancel(p: P, id: string, set: SetItems) {
  try {
    await p.cancelTurn(id)
    set((m) => markCancelled(m, id))
  } catch (err) {
    const cancelError = getCancelError(err)
    if (statusOf(err) === 409) {
      try {
        const current = await p.getTurn(id)
        set((m) => mergeTurn(m, { ...current, cancelError }))
        return
      } catch {}
    }
    set((m) => m.map((t) => (t.requestId === id ? { ...t, cancelError } : t)))
  }
}
