import { useEffect, useRef, useState } from 'react'
import type { PaneSummary } from '../domain/timeline'
import { canInterrupt, isLimitedPane } from '../domain/interrupt'
import { postInterrupt } from '../infra/interruptApi'
import { makeScope, runScope } from './interruptScope'
import r from '../resources.json'
const res = r as Record<string, string>
export function useInterrupt(t?: PaneSummary, on = true, conf?: (m: string) => boolean) {
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const s = useRef(makeScope())
  s.current.cur = t?.paneId
  useEffect(() => () => { s.current.live = false }, [])
  const can = canInterrupt(t, on, busy)
  const tip = !on ? res.unblockOffline : isLimitedPane(t) ? res.unblockLimited : res.unblockEsc
  const run = () => runScope(s.current, t, on, postInterrupt, conf ?? ((m: string) => window.confirm(m)), setMsg, setBusy)
  return { can, tip, msg, run, visible: !!t && t.status === 'blocked' }
}
