import type { PaneSummary } from '../domain/timeline'
import { triggerInterrupt } from './interruptAction'
import type { InterruptFn } from './interruptAction'

export type Scope = { busy: boolean; seq: number; live: boolean; cur?: string }
export function makeScope(): Scope {
  return { busy: false, seq: 0, live: true }
}
export async function runScope(
  s: Scope,
  t: PaneSummary | undefined,
  on: boolean,
  send: InterruptFn,
  conf: (m: string) => boolean,
  setMsg: (m: string | null) => void,
  setBusy: (b: boolean) => void,
): Promise<void> {
  if (s.busy) return
  const id = t?.paneId
  s.busy = true
  s.seq += 1
  const n = s.seq
  s.cur = id
  setBusy(true)
  try {
    const out = await triggerInterrupt(t, on, false, send, conf)
    if (!s.live || n !== s.seq || s.cur !== id) return
    if (out.message) setMsg(out.message)
  } finally {
    if (n === s.seq) s.busy = false
    if (s.live && n === s.seq) setBusy(false)
  }
}
