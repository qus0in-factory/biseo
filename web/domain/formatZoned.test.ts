import test from 'node:test'
import assert from 'node:assert/strict'
import { formatZoned } from './formatZoned'
test('formats ISO time in Asia/Seoul as yyyy-MM-dd HH:mm:ss', () => {
  assert.equal(formatZoned('2026-10-28T15:04:05.000Z', 'Asia/Seoul'), '2026-10-29 00:04:05')
  assert.equal(formatZoned('2026-01-01T00:00:00Z', 'Asia/Seoul'), '2026-01-01 09:00:00')
  assert.equal(formatZoned('bad', 'Asia/Seoul'), '')
})
