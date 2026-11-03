import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../index.js';
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js';
import { observedPanes } from '../../web/test-util/usage-panel-fixture.js';

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

test('authenticated Worker pane response preserves observed models and providers', async t => {
  const { env, cookie } = await createTimelineTestEnv()
  const payload = { workspaceId: 'w1T', panes: observedPanes }
  t.mock.method(globalThis, 'fetch', async () => Response.json(payload))
  const response = await app.fetch(new Request('https://local/api/workspaces/w1T/panes', {
    headers: { Cookie: cookie },
  }), env)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), payload)
})
