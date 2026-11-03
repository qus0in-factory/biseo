import test from 'node:test'
import assert from 'node:assert/strict'
import { snapshotReservation } from '../app/snapshot-reservation.js'

const input = { requestId: 'a', workspaceId: 'w', paneId: 'w:p1', text: 'hi' }

test('a reservation stores the pane name from the queue target', async () => {
  const q = { target: async () => ({ terminalId: 't1', ready: true, name: 'opus' }), execute: async () => true }
  assert.equal((await snapshotReservation(q, input, 'o')).targetName, 'opus')
})
