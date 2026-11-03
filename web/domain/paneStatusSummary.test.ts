import test from 'node:test'
import assert from 'node:assert/strict'
import { summarizePaneStatuses } from './paneStatusSummary'
import type { PaneSummary } from './timeline'

test('input count is exclusive and preserves unknown and duplicate handling', () => {
  const p: PaneSummary = { paneId: 'p', name: 'P', status: 'blocked', blockedReason: 'input_request', sendable: false, disabledReason: 'agent_blocked' }
  const out = summarizePaneStatuses([p, p, { ...p, paneId: 'q', blockedReason: 'unknown' }])
  assert.deepEqual(out, { idle: 0, working: 0, done: 0, blocked: 1, input_required: 1, unknown: 0, total: 2 })
})
const mk = (id: string, status: any) => ({ paneId: id, name: id, status, sendable: true, disabledReason: null })
test('counts four statuses and dedups by paneId', () => {
  const r = summarizePaneStatuses([mk('a', 'idle'), mk('b', 'working'), mk('c', 'done'), mk('d', 'blocked'), mk('a', 'working')])
  assert.deepEqual(r, { idle: 1, working: 1, done: 1, blocked: 1, input_required: 0, unknown: 0, total: 4 })
})
{
const mk = (id: string, status: any) => ({ paneId: id, name: id, status, sendable: true, disabledReason: null })
test('unknown for unknown/null/unsupported and null input', () => {
  const r = summarizePaneStatuses([mk('a', 'unknown'), mk('b', null), mk('c', 'foo')])
  assert.equal(r.unknown, 3)
  assert.equal(r.total, 3)
  assert.equal(summarizePaneStatuses(null as any).total, 0)
})
test('empty workspace yields zeros', () => {
  const r = summarizePaneStatuses([])
  assert.equal(r.total, 0)
})
}
