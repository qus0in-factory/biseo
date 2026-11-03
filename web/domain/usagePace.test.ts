import test from 'node:test'
import assert from 'node:assert/strict'
import { defaultUsagePace, parseUsagePace, serializeUsagePace, toggleUsagePace } from './usagePace'

test('pace storage round trips all independent weekly/monthly boolean combinations', () => {
  for (const w of [true, false]) for (const m of [true, false]) {
    assert.deepEqual(parseUsagePace(serializeUsagePace({ w, m })), { w, m })
  }
})

test('missing, damaged, null and nonboolean pace values fall back to enabled', () => {
  for (const raw of [null, '', '{broken', 'null', '{}', '[]', '42',
    '{"w":null,"m":0}', '{"w":"false","m":[]}', '{"w":{},"m":1}']) {
    assert.deepEqual(parseUsagePace(raw), { w: true, m: true }, String(raw))
  }
  assert.deepEqual(parseUsagePace('{"w":false,"m":"false"}'), { w: false, m: true })
  assert.deepEqual(parseUsagePace('{"w":null,"m":false}'), { w: true, m: false })
})

test('weekly and monthly toggles are independent and never mutate their input', () => {
  const initial = Object.freeze({ ...defaultUsagePace })
  const weekly = toggleUsagePace(initial, 'w')
  assert.deepEqual(weekly, { w: false, m: true })
  assert.deepEqual(toggleUsagePace(weekly, 'm'), { w: false, m: false })
  assert.deepEqual(toggleUsagePace(weekly, 'w'), initial)
  assert.deepEqual(initial, { w: true, m: true })
  assert.deepEqual(weekly, { w: false, m: true })
})
