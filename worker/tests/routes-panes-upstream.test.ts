import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

test('GET /api/workspaces/:wsId/panes rejects other workspace and non-https upstream', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const forbidden = await app.fetch(
    new Request('http://localhost/api/workspaces/other/panes', { headers: { Cookie: cookie } }),
    env,
  )
  assert.equal(forbidden.status, 403)
  assert.deepEqual(await forbidden.json(), { error: 'forbidden', reason: 'workspace_not_allowed' })

  const httpUpstream = await app.fetch(
    new Request('http://localhost/api/workspaces/w1T/panes', { headers: { Cookie: cookie } }),
    { ...env, FUNNEL_BASE_URL: 'http://funnel.example.com' },
  )
  assert.equal(httpUpstream.status, 502)
  assert.deepEqual(await httpUpstream.json(), { error: 'misconfigured' })
})
