import type { EventSub } from './first-session-snap.js'

export const ses = { source: 'herdr:opencode', agent: 'opencode', kind: 'id' as const, value: 'ses_7' }
export const tick = (n = 10) => new Promise((r) => setTimeout(r, n))
export const mk = (get: () => unknown) => {
  let n = 0
  const h = {
    getPane: async () => {
      n++
      return { pane_id: 'w:p1', terminal_id: 'term', agent: 'opencode', agent_session: get(), revision: 1 }
    },
    getAgent: async () => undefined,
  } as never
  return { h, reads: () => n }
}
export const mkSub = () => {
  const r = { ids: [] as string[][], ev: [] as ((e: string) => void)[], cl: [] as (() => void)[], un: 0 }
  const sub: EventSub = async (ids, ev, cl) => {
    r.ids.push(ids)
    r.ev.push(ev)
    r.cl.push(cl)
    return () => { r.un++ }
  }
  return { sub, r }
}
