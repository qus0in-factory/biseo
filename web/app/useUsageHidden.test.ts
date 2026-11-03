import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readFileSync } from 'node:fs'

const src = (f: string): string => readFileSync(new URL(f, new URL("../ui/usageLegacyBookmarks.test.ts", import.meta.url).href), 'utf8')

test('visibility uses a separate hidden key and leaves legacy bookmarks untouched', () => {
  const hidden = src('../app/useUsageHidden.ts')
  assert.match(hidden, /usageHiddenStorageKey/)
  assert.match(hidden, /parseUsageHidden/)
  assert.doesNotMatch(hidden, /usage-bookmarks/)
  assert.equal(existsSync(new URL('../app/useUsageBookmarks.ts', new URL("../ui/usageLegacyBookmarks.test.ts", import.meta.url).href)), false)
  assert.match(src('../resources.json'), /"usageHiddenStorageKey": "biseo:usage-provider-hidden"/)
})
