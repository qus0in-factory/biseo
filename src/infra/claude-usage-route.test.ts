import './test-util/claude-snapshot-env.test-util.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import { UsageCollector } from './usage-collector.js'

test('usage report does not call claude upstream', async () => {
  const urls: string[] = []
  const orig = globalThis.fetch
  globalThis.fetch = async (input) => {
    urls.push(String(input))
    return new Response('{}', { status: 503 })
  }
  try {
    const now = new Date('2026-11-07T00:00:00.000Z')
    const names = (await new UsageCollector().getReport(now)).providers.map(p => p.provider)
    assert.deepEqual(names, ['codex', 'claude', 'opencode-go', 'grok', 'ollama', 'agy'])
    assert.equal(urls.some(u => u.includes('anthropic.com')), false)
  } finally {
    globalThis.fetch = orig
  }
})
