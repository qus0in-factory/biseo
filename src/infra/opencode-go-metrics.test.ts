import test from 'node:test'
import assert from 'node:assert/strict'
import { parseOpencodeGo } from './opencode-go-parse.js'

test('OpenCode Go metrics preserve usage and remaining percentages', () => {
  const raw = { usage: {
    rolling: { percent: 10, resetsAt: '2026-11-01T00:00:00Z' },
    weekly: { percent: 55, resetsAt: '2026-11-07T00:00:00Z' },
    monthly: { percent: 70, resetsAt: '2026-11-30T00:00:00Z' }
  } }
  const { metrics } = parseOpencodeGo(raw, new Date('2026-10-30T06:00:00Z'))
  assert.deepEqual(metrics.map(({ id, used, remaining }) => [id, used, remaining]), [
    ['primary', 10, 90], ['secondary', 55, 45], ['monthly', 70, 30]
  ])
})
