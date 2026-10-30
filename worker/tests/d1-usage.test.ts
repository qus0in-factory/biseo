import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { usageReport } from './d1-usage-report.js'

const req = (cookie: string) => new Request('http://localhost/api/usage', { headers: { Cookie: cookie } })

test('usage stores actual window usedPercent and unknown values as null', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json(usageReport)) as any
  try {
    const first: any = await (await app.fetch(req(cookie), env)).json()
    const codex = first.providers.find((p: any) => p.provider === 'codex')
    const claude = first.providers.find((p: any) => p.provider === 'claude')
    assert.equal(codex.windows[0].usedPercent, 42)
    assert.equal(codex.windows[1].usedPercent, null)
    assert.equal(claude.windows[0].usedPercent, null)
  } finally { globalThis.fetch = orig }
})
