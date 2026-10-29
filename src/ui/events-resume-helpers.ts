import { PaneLocks } from '../app/pane-locks.js'
import { TurnStore } from '../app/turn-store.js'

export async function readFor(b: ReadableStream<Uint8Array> | null, pat: RegExp, ms = 3000) {
  const r = b!.getReader()
  const dec = new TextDecoder()
  let s = ''
  const t0 = Date.now()
  for (;;) {
    const { done, value } = await r.read()
    if (done) break
    s += dec.decode(value)
    if (pat.test(s) || Date.now() - t0 > ms) break
  }
  r.releaseLock()
  return s
}

export const deps = () => ({
  allowedWorkspaceId: 'w',
  herdr: { listPanes: async () => [], listAgents: async () => [] },
  store: new TurnStore(),
  locks: new PaneLocks(),
} as never)
