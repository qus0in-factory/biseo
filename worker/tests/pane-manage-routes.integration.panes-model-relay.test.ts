import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js'
import { observedPanes } from '../../web/domain/usage-panel-fixture.test-util.js'

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
