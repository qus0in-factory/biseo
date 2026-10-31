import assert from 'node:assert/strict'
import test from 'node:test'
import { summarizePaneStatuses } from './paneStatusSummary.js'
const mk = (id: string, status: any) => ({ paneId: id, name: id, status, sendable: true, disabledReason: null })
test('counts four statuses and dedups by paneId', () => {
  const r = summarizePaneStatuses([mk('a', 'idle'), mk('b', 'working'), mk('c', 'done'), mk('d', 'blocked'), mk('a', 'working')])
  assert.deepEqual(r, { idle: 1, working: 1, done: 1, blocked: 1, unknown: 0, total: 4 })
})
