import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { oneWindow } from './d1-usage-report.js'

const req = (c: string) => new Request('http://localhost/api/usage', { headers: { Cookie: c } })
const empty = { providers: [{ provider: 'codex', state: 'unknown', windows: [] }] }

test('an empty window report clears the old percent', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  let body: unknown = oneWindow
  globalThis.fetch = (async () => Response.json(body)) as any
  try {
    const first: any = await (await app.fetch(req(cookie), env)).json()
    assert.equal(first.providers[0].windows[0].usedPercent, 7)
    body = empty
    const second: any = await (await app.fetch(req(cookie), env)).json()
    assert.equal(second.stale, false)
    assert.equal(second.providers[0].windows[0].usedPercent, null)
  } finally { globalThis.fetch = orig }
})
