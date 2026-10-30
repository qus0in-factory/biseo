import test from 'node:test'
import assert from 'node:assert/strict'
import { parseOpencodeGo } from './opencode-go-parse.js'

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
