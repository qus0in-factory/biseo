import test from 'node:test'
import assert from 'node:assert/strict'
import { makeOptimistic } from './optimistic.js'
import type { PaneSummary } from './timeline.js'

test('makeOptimistic creates turn with prompt and queued status', () => {
  const p: PaneSummary = {
    paneId: 'p1',
    name: 'P1',
    status: 'idle',
    sendable: true,
    disabledReason: null,
  }
  const { requestId, item } = makeOptimistic('w1', p, 'prompt')
  assert.ok(requestId.length > 0)
  assert.equal(item.status, 'queued')
  assert.equal(item.promptText, 'prompt')
})
