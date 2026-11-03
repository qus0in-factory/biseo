import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js'
import { insertRow } from '../test-util/d1-row.js'
import { delTurn } from '../test-util/d1-requests.js'

test('cancellation isolates owners and workspaces before upstream access', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const original = globalThis.fetch
  globalThis.fetch = async () => { throw new Error('unexpected upstream access') }
  try {
    for (const status of ['queued', 'working']) {
      for (const [owner, workspace] of [['other', 'w1T'], ['owner', 'other']]) {
        const id = `${status}-${owner}-${workspace}`
        await insertRow(env.BISEO_DB, id, owner, workspace, status)
        assert.equal((await app.fetch(delTurn(id, cookie), env)).status, 404)
      }
    }
    assert.equal((await app.fetch(delTurn('missing', cookie), env)).status, 404)
  } finally { globalThis.fetch = original }
})
