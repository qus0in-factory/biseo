import test from 'node:test'
import assert from 'node:assert/strict'
import { parseOpencodeGo } from './opencode-go-parse.js'

test('parseOpencodeGo maps rolling, weekly and monthly windows', () => {
  const now = new Date('2026-10-30T10:00:00Z')
  const raw = {
    usage: {
      rolling: { percent: 5, resetsAt: '2026-10-30T15:00:00Z' },
      weekly: { percent: 65, resetsAt: '2026-11-02T00:00:00Z' },
      monthly: { percent: 40, resetsAt: '2026-11-30T00:00:00Z' }
    }
  }
  const res = parseOpencodeGo(raw, now)
  assert.equal(res.state, 'available')
  assert.equal(res.windows.length, 3)
  assert.equal(res.windows[0].window, 'primary')
  assert.equal(res.windows[0].usedPercent, 5)
  assert.equal(res.windows[1].window, 'secondary')
  assert.equal(res.windows[1].usedPercent, 65)
  assert.equal(res.windows[2].window, 'monthly')
  assert.equal(res.windows[2].usedPercent, 40)
  assert.equal(res.windows[2].resetsAt, '2026-11-30T00:00:00Z')
})

test('parseOpencodeGo limited on any active limitReached window', () => {
  const now = new Date('2026-10-30T10:00:00Z')
  const raw = {
    usage: {
      monthly: { percent: 100, resetsAt: '2026-11-30T00:00:00Z' }
    }
  }
  const res = parseOpencodeGo(raw, now)
  assert.equal(res.state, 'limited')
})

test('parseOpencodeGo missing', () => {
  assert.equal(parseOpencodeGo(null).state, 'unknown')
})

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
