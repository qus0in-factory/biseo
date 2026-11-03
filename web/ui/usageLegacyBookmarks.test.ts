import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const src = (f: string): string => readFileSync(new URL(f, import.meta.url), 'utf8')

test('visibility uses a separate hidden key and leaves legacy bookmarks untouched', () => {
  const hidden = src('../app/useUsageHidden.ts')
  assert.match(hidden, /usageHiddenStorageKey/)
  assert.match(hidden, /parseUsageHidden/)
  assert.doesNotMatch(hidden, /usage-bookmarks/)
  assert.equal(existsSync(new URL('../app/useUsageBookmarks.ts', import.meta.url)), false)
  assert.match(src('../resources.json'), /"usageHiddenStorageKey": "biseo:usage-provider-hidden"/)
})
