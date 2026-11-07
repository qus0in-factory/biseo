import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCodexWham } from '../../src/infra/codex-wham-parse.js'
import { selectCardMetrics } from './usage-ollama.js'
import { usageHeaderStatus } from './usage-header-status.js'
import type { UsageMetric } from './usage.js'
import { showMetricReset } from './usage-ollama.js'
import { visibleOllamaMetric } from './usage-ollama.js'

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
test('unknown metrics are preserved for non-ollama providers', () => {
  const metrics: UsageMetric[] = [
    { id: 'w', label: 'w', unit: 'percent', used: 20, limit: 100, remaining: 80, resetsAt: null },
    { id: 'unknown', label: 'unknown', unit: 'percent', used: null, limit: 100, remaining: null, resetsAt: null },
  ]
  for (const provider of ['claude', 'agy', 'grok', 'codex']) {
    const kept = selectCardMetrics(provider, metrics).map((x) => x.id)
    assert.deepEqual(kept, ['w', 'unknown'])
  }
})

test('ollama provider filters out non-balance metrics including unknown', () => {
  const metrics: UsageMetric[] = [
    { id: 'included_balance', label: 'inc', unit: 'currency', used: 5, limit: 10, remaining: 5, resetsAt: null },
    { id: 'unknown', label: 'unknown', unit: 'percent', used: null, limit: 100, remaining: null, resetsAt: null },
  ]
  const kept = selectCardMetrics('ollama', metrics).map((x) => x.id)
  assert.deepEqual(kept, ['included_balance'])
})
const m = (id: string): UsageMetric => ({
  id, label: id, unit: 'currency', used: 1, limit: null, remaining: 1, resetsAt: null,
})

test('only the ollama purchased balance hides its reset line', () => {
  assert.equal(showMetricReset('ollama', m('purchased_balance')), false)
  assert.equal(showMetricReset('ollama', m('included_balance')), true)
  assert.equal(showMetricReset('claude', m('purchased_balance')), true)
})

test('the allowlist covers exactly the two balances', () => {
  assert.equal(visibleOllamaMetric(m('included_balance')), true)
  assert.equal(visibleOllamaMetric(m('purchased_balance')), true)
  assert.equal(visibleOllamaMetric(m('requests')), false)
})
{
const m = (id: string): UsageMetric => ({
  id, label: id, unit: 'tokens', used: 1, limit: null, remaining: null, resetsAt: null,
})

test('ollama keeps only the two balances', () => {
  const ids = ['cached_input_tokens', 'included_balance', 'input_tokens', 'purchased_balance', 'requests']
  const kept = selectCardMetrics('ollama', ids.map(m)).map((x) => x.id)
  assert.deepEqual(kept, ['included_balance', 'purchased_balance'])
})

test('other providers keep every metric', () => {
  const ids = ['five_hour', 'session']
  assert.deepEqual(selectCardMetrics('claude', ids.map(m)).map((x) => x.id), ids)
})

test('opencode-go keeps only its three usage windows', () => {
  const ids = ['primary', 'secondary', 'monthly', 'unknown']
  assert.deepEqual(selectCardMetrics('opencode-go', ids.map(m)).map((x) => x.id), ['primary', 'secondary', 'monthly'])
})
}
