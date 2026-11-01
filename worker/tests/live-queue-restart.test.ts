import test from 'node:test'
import assert from 'node:assert/strict'
import { liveQueueFixture } from './live-queue-fixture.js'
import { dispatchQueue } from '../app/dispatch-queue.js'
import { cancelReservation } from '../app/cancel-reservation.js'
import { runD1Queue } from '../app/run-d1-queue.js'
import { findTurn } from '../infra/d1-timeline-find.js'

test('missed callback recovery persists output and advances remaining FIFO once', async () => {
  const { db, sent, q, completed } = await liveQueueFixture()
  await dispatchQueue(db, q, 'w', 'p')
  await cancelReservation(db, 'middle', 'o')
  const scope = { workspaceId: 'w', ownerSubject: 'o' }
  const first = (await findTurn(db, scope, 'first'))!
  await runD1Queue(db, q, completed(first) as any)
  await runD1Queue(db, q, completed(first) as any)
  assert.deepEqual(sent, ['first', 'last'])
  assert.equal((await findTurn(db, scope, 'first'))?.responseText, 'local result')
  assert.equal((await findTurn(db, scope, 'middle'))?.status, 'cancelled')
})
