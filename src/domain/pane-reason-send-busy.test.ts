import test from 'node:test'
import assert from 'node:assert/strict'
import { paneReason } from './pane-reason.js'

test('done panel with active lock does not retain agent_busy', () => {
  const ses = { source: 'herdr:claude', agent: 'claude', kind: 'id' as const, value: 's1' }
  const r = paneReason('done', 'claude', undefined, true, ses)
  assert.equal(r, null)
})

test('blocked panel is prioritized over lock', () => {
  const r = paneReason('blocked', 'claude', undefined, true, undefined)
  assert.equal(r, 'agent_blocked')
})
