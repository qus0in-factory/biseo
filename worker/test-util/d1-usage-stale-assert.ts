import assert from 'node:assert/strict'
import type { ProviderUsage } from '../infra/d1-usage-types.js'

export const assertPreserved = (cx: ProviderUsage, gk: ProviderUsage) => {
  const w = (p: ProviderUsage, id: string) => p.windows.find(x => x.window === id)
  assert.equal(cx.reason, 'auth_required')
  assert.equal(w(cx, '5h')?.usedPercent, 42)
  assert.equal(w(cx, '5h')?.resetsAt, '2026-11-02T16:00:00Z')
  assert.equal(w(cx, 'w')?.usedPercent, 15)
  assert.equal(w(cx, 'w')?.resetsAt, '2026-11-08T00:00:00Z')
  assert.equal(gk.reason, 'auth_required')
  assert.equal(gk.windows[0].usedPercent, 25)
  assert.equal(gk.windows[0].resetsAt, '2026-11-02T17:00:00Z')
}
