import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string): string => readFileSync(new URL(f, import.meta.url), 'utf8')

test('the live modal path renders the claude cache note', () => {
  const dash = src('./UsageDashboardContent.tsx')
  assert.match(dash, /UsagePanelRow/)
  assert.match(dash, /providers\.map/)
  const fields = src('./UsagePanelFields.tsx')
  assert.match(fields, /UsageCacheNote/)
  assert.match(fields, /<UsageCacheNote provider=\{provider\} \/>/)
  const note = src('./UsageCacheNote.tsx')
  assert.match(note, /cacheNote/)
})

test('the cache note marks only claude-cache readings', () => {
  const lib = src('../domain/usage-cache.ts')
  assert.match(lib, /provider !== 'claude'/)
  assert.match(lib, /claude-cache/)
  assert.match(lib, /usageStale/)
  assert.match(lib, /usageLastSuccess/)
})
