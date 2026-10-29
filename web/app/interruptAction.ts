import { canInterrupt, INTERRUPT_KEY } from '../domain/interrupt'
import type { PaneSummary } from '../domain/timeline'
import type { InterruptResult } from '../infra/interruptApi'
import r from '../resources.json'

const res = r as Record<string, string>
export type InterruptFn = (id: string, key: 'esc') => Promise<InterruptResult>

export async function triggerInterrupt(
  t: PaneSummary | undefined,
  on: boolean,
  busy: boolean,
  send: InterruptFn,
  conf: (msg: string) => boolean,
): Promise<{ called: boolean; message: string | null }> {
  if (!canInterrupt(t, on, busy)) return { called: false, message: null }
  if (!conf(res.unblockConfirm)) return { called: false, message: null }

  const r = await send(t!.paneId, INTERRUPT_KEY)
  const m = r.ok ? res.unblockSuccess : r.conflict ? res.unblockConflict : res.unblockFailed
  return { called: true, message: m }
}
