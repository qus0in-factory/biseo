import { useState } from 'react'
import type { PaneSummary } from '../domain/timeline'
import { canInterrupt, isLimitedPane } from '../domain/interrupt'
import { triggerInterrupt } from './interruptAction'
import { postInterrupt } from '../infra/interruptApi'
import r from '../resources.json'

const res = r as Record<string, string>

export function useInterrupt(
  t?: PaneSummary,
  on: boolean = true,
  conf?: (m: string) => boolean,
) {
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const can = canInterrupt(t, on, busy)
  const tip = !on ? res.unblockOffline : isLimitedPane(t) ? res.unblockLimited : res.unblockEsc

  const run = async () => {
    setBusy(true)
    const ask = conf ?? ((m: string) => window.confirm(m))
    const out = await triggerInterrupt(t, on, false, postInterrupt, ask)
    if (out.message) setMsg(out.message)
    setBusy(false)
  }

  return { can, tip, msg, run, visible: !!t && t.status === 'blocked' }
}
