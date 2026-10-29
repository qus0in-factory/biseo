import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { formatTime } from './timeFormat.js'

describe('timeFormat', () => {
  it('returns empty string for null or undefined or empty', () => {
    assert.equal(formatTime(), '')
    assert.equal(formatTime(null), '')
    assert.equal(formatTime(''), '')
  })

  it('returns empty string for invalid date', () => {
    assert.equal(formatTime('invalid-date'), '')
  })

  it('formats valid ISO string', () => {
    const formatted = formatTime('2026-10-29T10:30:00.000Z')
    assert.match(formatted, /\d{1,2}:\d{2}/)
  })
})
