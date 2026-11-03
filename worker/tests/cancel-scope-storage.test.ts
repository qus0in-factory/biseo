import test from 'node:test'
import assert from 'node:assert/strict'
import { cancelScope } from '../ui/cancel-scope.js'
import { queueFixture } from '../test-util/queue-fixture.js'

test('cancel scope fails closed on configuration, invalid IDs and storage failure', async () => {
  const { db, put } = await queueFixture()
  await put('a')
  assert.equal(await cancelScope(db, 'w', 'o', 'a'), null)
  assert.equal((await cancelScope(db, undefined, 'o', 'a'))?.status, 500)
  assert.equal((await cancelScope(db, 'w', 'o', '../a'))?.status, 400)
  db.prepare = () => { throw new Error('storage unavailable') }
  await assert.rejects(cancelScope(db, 'w', 'o', 'a'), /storage unavailable/)
})
