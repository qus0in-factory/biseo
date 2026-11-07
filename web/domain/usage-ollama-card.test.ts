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
