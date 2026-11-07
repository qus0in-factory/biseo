import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCodexWham } from '../../src/infra/codex-wham-parse.js'
import { selectCardMetrics } from './usage-ollama.js'
test('corrupted and non-ollama unknown metrics are preserved for display', () => {
  const p = parseCodexWham({ rate_limit: { primary_window: {}, secondary_window: { used_percent: 25, limit_window_seconds: 604800 } } })
  assert.deepEqual(selectCardMetrics(p.provider, p.metrics as any).map(r => r.id), ['unknown', 'w'])
  const row = { id: 'unknown', label: 'u', unit: 'percent' as const, used: null, limit: 100, remaining: null, resetsAt: null }
  assert.deepEqual(selectCardMetrics('claude', [row]).map(r => r.id), ['unknown'])
})
