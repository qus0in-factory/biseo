import test from 'node:test'
import assert from 'node:assert/strict'
import { summarizePaneStatuses } from './paneStatusSummary'
import type { PaneSummary } from './timeline'
test('input count is exclusive and preserves unknown and duplicate handling', () => {
  const p: PaneSummary = { paneId: 'p', name: 'P', status: 'blocked', blockedReason: 'input_request', sendable: false, disabledReason: 'agent_blocked' }
  const out = summarizePaneStatuses([p, p, { ...p, paneId: 'q', blockedReason: 'unknown' }])
  assert.deepEqual(out, { idle: 0, working: 0, done: 0, blocked: 1, input_required: 1, unknown: 0, total: 2 })
})
