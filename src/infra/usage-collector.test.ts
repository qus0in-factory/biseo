import test from 'node:test'
import assert from 'node:assert/strict'
import { formatCodexWindows } from '../domain/usage-format.js'
import { UsageCollector } from './usage-collector.js'
import type { RateLimits } from '../domain/availability.js'

test('formatCodexWindows preserves both primary and secondary values', () => {
  const r: RateLimits = {
    reached: null,
    primary: '2026-10-30T00:00:00.000Z',
    secondary: '2026-11-05T00:00:00.000Z',
    primaryUsedPercent: 20,
    secondaryUsedPercent: 90,
    snapshotAt: '2026-10-29T21:00:00.000Z',
  }
  const u = formatCodexWindows(r, new Date('2026-10-29T20:00:00.000Z'))
  assert.equal(u.provider, 'codex')
  assert.equal(u.state, 'available')
  assert.equal(u.windows.length, 2)
  assert.equal(u.windows[0].window, 'primary')
  assert.equal(u.windows[0].usedPercent, 20)
  assert.equal(u.windows[0].resetsAt, '2026-10-30T00:00:00.000Z')
  assert.equal(u.windows[1].window, 'secondary')
  assert.equal(u.windows[1].usedPercent, 90)
  assert.equal(u.windows[1].resetsAt, '2026-11-05T00:00:00.000Z')
})

test('formatCodexWindows handles missing values as null without estimates', () => {
  const r: RateLimits = {
    reached: null,
    primary: null,
    secondary: null,
    primaryUsedPercent: null,
    secondaryUsedPercent: null,
    snapshotAt: null,
  }
  const u = formatCodexWindows(r, new Date())
  assert.equal(u.windows[0].usedPercent, null)
  assert.equal(u.windows[0].resetsAt, null)
  assert.equal(u.windows[1].usedPercent, null)
})

test('UsageCollector returns unknown with empty windows on failure without disguise', async () => {
  const c = new UsageCollector()
  const prevDir = process.env.BISEO_CODEX_DIR
  process.env.BISEO_CODEX_DIR = '/nonexistent/path'
  try {
    const rep = await c.getReport()
    assert.equal(rep.providers[0].provider, 'codex')
    assert.equal(rep.providers[0].state, 'unknown')
    assert.equal(rep.providers[0].windows.length, 0)
  } finally {
    if (prevDir === undefined) delete process.env.BISEO_CODEX_DIR
    else process.env.BISEO_CODEX_DIR = prevDir
  }
})
