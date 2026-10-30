import test from 'node:test'
import assert from 'node:assert/strict'
import { parseOpencodeGo } from './opencode-go-parse.js'

test('parseOpencodeGo maps windows', () => {
  const now = new Date('2026-10-30T10:00:00Z')
  const raw = {
    usage: {
      rolling: { percent: 5, resetsAt: '2026-10-30T15:00:00Z' },
      weekly: { percent: 65, resetsAt: '2026-11-02T00:00:00Z' }
    }
  }
  const res = parseOpencodeGo(raw, now)
  assert.equal(res.state, 'available')
  assert.equal(res.windows[0].usedPercent, 5)
  assert.equal(res.windows[1].usedPercent, 65)
})

test('parseOpencodeGo limited', () => {
  const now = new Date('2026-10-30T10:00:00Z')
  const raw = {
    usage: {
      rolling: { percent: 100, resetsAt: '2026-10-30T15:00:00Z' }
    }
  }
  const res = parseOpencodeGo(raw, now)
  assert.equal(res.state, 'limited')
})

test('parseOpencodeGo missing', () => {
  assert.equal(parseOpencodeGo(null).state, 'unknown')
})
