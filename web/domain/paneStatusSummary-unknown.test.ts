import assert from 'node:assert/strict'
import test from 'node:test'
import { summarizePaneStatuses } from './paneStatusSummary.js'
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
