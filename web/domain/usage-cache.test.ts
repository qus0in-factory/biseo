import test from 'node:test'
import assert from 'node:assert/strict'
import { cacheNote } from './usage-cache.js'
import type { UsageProvider } from './usage.js'
import r from '../resources.json'

const res = r as Record<string, string>

type Marked = UsageProvider & { source?: string | null; checkedAt?: string | null }

const mk = (m: Marked): UsageProvider => m

const base: Marked = { provider: 'claude', state: 'available', windows: [] }

test('a cache mark yields a note with the base time', () => {
  const at = '2026-10-30T10:00:00.000Z'
  const p = mk({ ...base, source: 'claude-cache', checkedAt: at })
  const n = cacheNote(p, res)
  assert.ok((n as string).includes(res.usageStale))
  assert.ok((n as string).includes(res.usageLastSuccess))
})

test('a fresh reading yields no note', () => {
  assert.equal(cacheNote(mk({ ...base, source: 'claude' }), res), null)
})
