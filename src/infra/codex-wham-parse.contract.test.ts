import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCodexWham } from './codex-wham-parse.js'

{

{

test('secondary-only weekly plan also omits absent five-hour window', () => {
  const result = parseCodexWham({ rate_limit: { secondary_window: {
    used_percent: 42, limit_window_seconds: 604800, reset_after_seconds: 60
  } } }, new Date('2026-11-01T00:00:00Z'))
  assert.equal(result.state, 'available')
  assert.equal(result.windows[0].window, 'w')
  assert.equal(result.windows.length, 1)
  assert.equal(result.metrics.length, 1)
  assert.equal(result.windows[0].usedPercent, 42)
  assert.equal(result.windows.some(w => w.window === 'unknown'), false)
  assert.equal(result.metrics.some(m => m.id === 'unknown'), false)
})
}
{

test('corrupted window is preserved as unknown', () => {
  const e = parseCodexWham({ rate_limit: { primary_window: {} } })
  assert.equal(e.windows.length, 1)
  assert.equal(e.windows[0].window, 'unknown')
  assert.equal(e.windows[0].usedPercent, null)
  assert.equal(e.state, 'unknown')
  assert.equal(e.metrics[0].id, 'unknown')

  const b = parseCodexWham({ rate_limit: { primary_window: { used_percent: 'bad' } } })
  assert.equal(b.windows[0].window, 'unknown')
  assert.equal(b.state, 'unknown')
})

test('corrupted window mixed with valid window preserves both', () => {
  const m = parseCodexWham({ rate_limit: {
    primary_window: { used_percent: 'bad' },
    secondary_window: { used_percent: 40, limit_window_seconds: 604800 }
  } })
  assert.equal(m.windows.length, 2)
  assert.equal(m.windows[0].window, 'unknown')
  assert.equal(m.windows[1].window, 'w')
  assert.equal(m.metrics[0].id, 'unknown')
  assert.equal(m.metrics[1].id, 'w')
  assert.equal(m.state, 'available')
})
}
{

test('empty windows are unknown without errors', () => {
  const result = parseCodexWham({ rate_limit: {} })
  assert.equal(result.state, 'unknown')
  assert.equal(result.windows.length, 0)
  assert.ok(result.windows.every(w => w.window === 'unknown' && w.usedPercent === null))
})

test('a reset timestamp alone never implies a quota duration', () => {
  const result = parseCodexWham({ rate_limit: { primary_window: {
    used_percent: 99, reset_at: 1793858316
  } } })
  assert.equal(result.windows[0].window, 'unknown')
})
}
{

test('provider limit flag is preserved', () => {
  const result = parseCodexWham({ rate_limit: { limit_reached: true } })
  assert.equal(result.state, 'limited')
})

test('only an active exhausted window implies a limit', () => {
  for (const [reset, state] of [[120, 'limited'], [0, 'available']] as const) {
    const result = parseCodexWham({ rate_limit: { primary_window: {
      used_percent: 100, limit_window_seconds: 604800, reset_after_seconds: reset
    } } }, new Date('2026-11-01T00:00:00Z'))
    assert.equal(result.state, state)
  }
})
}
}
{

test('primary-only weekly plan is weekly, not five-hour', () => {
  const result = parseCodexWham({ rate_limit: { primary_window: {
    used_percent: 97, limit_window_seconds: 604800, reset_after_seconds: 120
  } } }, new Date('2026-11-01T00:00:00Z'))
  assert.equal(result.state, 'available')
  assert.equal(result.windows[0].window, 'w')
  assert.equal(result.windows[0].resetsAt, '2026-11-01T00:02:00.000Z')
  assert.equal(result.metrics[0].id, 'w')
  assert.equal(result.windows.some(w => w.window === '5h'), false)
  assert.equal(result.windows.length, 1)
  assert.equal(result.metrics.length, 1)
})
}
