import test from 'node:test'
import assert from 'node:assert/strict'
import { usageRelativeTime } from './usageRelativeTime'

test('relative reset labels cover minutes, hours, days, past and invalid input', () => {
  const now = Date.parse('2026-11-03T00:00:00Z')
  const text = (minutes: number) => usageRelativeTime(new Date(now + minutes * 60_000).toISOString(), now)
  assert.equal(text(17), '17분 후')
  assert.equal(text(120), '2시간 후')
  assert.equal(text(7200), '5일 후')
  assert.equal(text(-17), '17분 전')
  assert.equal(text(0), '0분 후')
  assert.equal(text(0.5), '1분 후')
  assert.equal(usageRelativeTime('invalid', now), null)
})
