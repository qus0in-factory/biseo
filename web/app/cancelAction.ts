import type { WorkspaceApiPort as P } from '../domain/ports'
import type { TimelineItem as I } from '../domain/timeline'
import { markCancelled } from '../domain/markCancelled'
import r from '../resources.json'

const res = r as Record<string, string>
type SetItems = React.Dispatch<React.SetStateAction<I[]>>

function getCancelError(e: unknown): string {
  const status = (e as { response?: { status?: number } })?.response?.status
  return status === 409
    ? (res.cancelConflict ?? '이미 실행 중입니다.')
    : (res.cancelFailed ?? '취소에 실패했습니다.')
}

export async function executeCancel(p: P, id: string, set: SetItems) {
  try {
    await p.cancelTurn(id)
    set((m) => markCancelled(m, id))
  } catch (err) {
    const cancelError = getCancelError(err)
    set((m) => m.map((t) => (t.requestId === id ? { ...t, cancelError } : t)))
  }
}
