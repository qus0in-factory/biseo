import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('usage tabs wait for AsyncList before showing the bookmark empty text', () => {
  const body = src('./UsageModalBody.tsx')
  assert.match(body, /state=\{state\}/)
  assert.match(body, /retry=\{retry\}/)
  const asyncTabs = src('./UsageTabsAsync.tsx')
  assert.match(asyncTabs, /<AsyncList/)
  assert.match(asyncTabs, /onRetry=\{retry\}/)
  assert.match(asyncTabs, /r\.usageEmpty/)
  assert.match(src('./UsageTabContent.tsx'), /usageBookmarkEmpty/)
})

test('usage tabs and list use provider types instead of any', () => {
  for (const f of ['./UsageTabs.tsx', './UsageTabList.tsx', './UsageTabContent.tsx']) {
    assert.doesNotMatch(src(f), /\bany\b/)
  }
})
