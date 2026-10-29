import test from 'node:test'
import assert from 'node:assert/strict'
import {
  isLimited,
  normalizeAvailability,
  unknownAvailability,
} from './availability.js'
import { codexAvailability } from './codex-availability.js'

const now = new Date('2026-10-29T10:00:00.000Z')
const future = '2026-10-29T11:00:00.000Z'
const past = '2026-10-29T09:00:00.000Z'

test('only a reached rate limit is limited', () => {
  const missing = codexAvailability(null, now)
  assert.equal(missing.state, 'unknown')
  const free = codexAvailability({ reached: null, primary: future, secondary: null }, now)
  assert.equal(free.state, 'available')
  assert.equal(free.source, 'codex')
  const limited = codexAvailability(
    { reached: 'secondary', primary: future, secondary: future },
    now,
  )
  assert.equal(limited.state, 'limited')
  assert.equal(limited.window, 'secondary')
  assert.equal(limited.resetsAt, future)
  assert.equal(limited.reason, 'rate_limit_reached')
})

test('a missing or elapsed reset becomes unknown', () => {
  assert.equal(
    codexAvailability({ reached: 'primary', primary: null, secondary: null }, now).state,
    'unknown',
  )
  assert.equal(
    codexAvailability({ reached: 'primary', primary: past, secondary: null }, now).state,
    'unknown',
  )
})

test('the reached window is matched exactly', () => {
  const other = '2026-10-29T12:00:00.000Z'
  const a = codexAvailability(
    { reached: 'xsecondary', primary: future, secondary: other },
    now,
  )
  assert.equal(a.state, 'limited')
  assert.equal(a.window, 'primary')
  assert.equal(a.resetsAt, future)
})

test('normalization releases an expired or resetless limited state', () => {
  const active = {
    ...unknownAvailability(now),
    state: 'limited' as const,
    source: 'codex',
    resetsAt: future,
  }
  assert.equal(isLimited(active), true)
  assert.equal(normalizeAvailability(active, now).state, 'limited')
  const expired = normalizeAvailability(active, new Date('2026-10-29T12:00:00.000Z'))
  assert.equal(expired.state, 'unknown')
  assert.equal(expired.resetsAt, null)
  assert.equal(expired.source, 'codex')
  const resetless = normalizeAvailability({ ...active, resetsAt: null }, now)
  assert.equal(resetless.state, 'unknown')
  assert.equal(isLimited(resetless), false)
})
