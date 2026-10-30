import test from 'node:test'
import assert from 'node:assert/strict'
import { UsageCollector } from './usage-collector.js'

test('UsageCollector aggregates 6 providers with valid schema', async () => {
  const collector = new UsageCollector()
  const report = await collector.getReport()
  assert.ok(report.updatedAt)
  assert.equal(report.providers.length, 6)

  const names = report.providers.map(p => p.provider)
  assert.deepEqual(names, ['codex', 'claude', 'opencode-go', 'grok', 'ollama', 'agy'])

  for (const p of report.providers) {
    assert.ok(['available', 'limited', 'unknown'].includes(p.state))
    assert.ok(Array.isArray(p.windows))
    for (const w of p.windows) {
      assert.ok(['primary', 'secondary'].includes(w.window))
      assert.ok(typeof w.limitReached === 'boolean')
    }
  }
})
