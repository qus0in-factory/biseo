import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js'
import { insertRow } from '../test-util/d1-row.js'
import { delTurn } from '../test-util/d1-requests.js'
import { cancelScope } from '../ui/cancel-scope.js'
import { queueFixture } from '../test-util/queue-fixture.js'

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

test('cancel scope fails closed on configuration, invalid IDs and storage failure', async () => {
  const { db, put } = await queueFixture()
  await put('a')
  assert.equal(await cancelScope(db, 'w', 'o', 'a'), null)
  assert.equal((await cancelScope(db, undefined, 'o', 'a'))?.status, 500)
  assert.equal((await cancelScope(db, 'w', 'o', '../a'))?.status, 400)
  db.prepare = () => { throw new Error('storage unavailable') }
  await assert.rejects(cancelScope(db, 'w', 'o', 'a'), /storage unavailable/)
})
