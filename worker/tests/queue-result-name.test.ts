import test from 'node:test'
import assert from 'node:assert/strict'
import { queueFixture } from './queue-fixture.js'
import { claimTurn } from '../infra/d1-queue-claim.js'
import { startTurn } from '../infra/d1-queue-start.js'
import { reconcileQueue } from '../app/reconcile-queue.js'

test('queue completion stores the pane label', async () => {
  const { db, put } = await queueFixture()
  await put('a')
  const now = Date.now()
  const r = (await claimTurn(db, 'w', 'p', 'token', now, 120000))!
  await startTurn(db, { id: 'a', token: 'token', now })
  const data = { ...r, status: 'completed' as const, targetName: 'opus', agentKind: 'claude' }
  const up = { getTurn: async () => ({ ok: true as const, data }) }
  assert.equal((await reconcileQueue(db, up as never, r)).targetName, 'opus')
  const row = await db.prepare('SELECT target_name name FROM timeline_turns').first()
  assert.deepEqual(row, { name: 'opus' })
})
