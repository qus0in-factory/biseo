import test from 'node:test'
import assert from 'node:assert/strict'
import { cacheNote } from './usage-cache.js'
import type { UsageProvider } from './usage.js'
import r from '../resources.json'

const res = r as Record<string, string>

test('other providers never yield a note', () => {
  const p: UsageProvider = { provider: 'grok', state: 'available', windows: [] }
  const marked = { ...p, source: 'grok-stale' }
  assert.equal(cacheNote(marked, res), null)
})
