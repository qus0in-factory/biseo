import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js'

test('management mutations reject absent and foreign origins', async (t) => {
  t.mock.method(globalThis, 'fetch', () => { throw new Error('unexpected upstream') })
  const { env, cookie } = await createTimelineTestEnv()
  for (const [method, path] of [
    ['POST', '/api/panes'],
    ['DELETE', '/api/panes/w1T:p1'],
    ['POST', '/api/panes/w1T:p1/rename'],
    ['POST', '/api/workspaces/select'],
  ]) {
    for (const origin of ['', 'https://foreign.invalid']) {
      const headers: Record<string, string> = { Cookie: cookie }
      if (origin) headers.Origin = origin
      const res = await app.fetch(new Request(`http://localhost${path}`, {
        method, headers,
      }), env)
      assert.equal(res.status, 403)
      assert.deepEqual(await res.json(), {
        error: 'forbidden', reason: 'origin_not_allowed',
      })
    }
  }
})
