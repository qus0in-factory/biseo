import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCodexWham } from '../../src/infra/codex-wham-parse.js'
import { selectCardMetrics } from './usage-ollama.js'
import { usageHeaderStatus } from './usage-header-status.js'

test('pro plan card contract: absent 5h window produces no dummy row', () => {
  const p = parseCodexWham({ rate_limit: { primary_window: { used_percent: 25, limit_window_seconds: 604800 } } })
  const rows = selectCardMetrics(p.provider, p.metrics as any)
  assert.deepEqual(rows.map(r => r.id), ['w'])
  assert.equal(usageHeaderStatus(p as any, {}).icon, 'check')
})

test('corrupted and non-ollama unknown metrics are preserved for display', () => {
  const p = parseCodexWham({ rate_limit: { primary_window: {}, secondary_window: { used_percent: 25, limit_window_seconds: 604800 } } })
  const rows = selectCardMetrics(p.provider, p.metrics as any)
  assert.deepEqual(rows.map(r => r.id), ['unknown', 'w'])

  const cRows = selectCardMetrics('claude', [{ id: 'unknown', label: 'u', unit: 'percent', used: null, limit: 100, remaining: null, resetsAt: null }])
  assert.deepEqual(cRows.map(r => r.id), ['unknown'])
})
