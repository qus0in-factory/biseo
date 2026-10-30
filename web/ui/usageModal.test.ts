import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

describe('UsageModal', () => {
  it('has bookmarked tab and empty guidance', () => {
    const src = readFileSync(new URL('./UsageTabList.tsx', import.meta.url), 'utf8')
    assert.match(src, /value="bookmarked"/)
    const content = readFileSync(new URL('./UsageTabContent.tsx', import.meta.url), 'utf8')
    assert.match(content, /usageBookmarkEmpty/)
  })
  it('has remaining toggle', () => {
    const src = readFileSync(new URL('./UsageModeToggle.tsx', import.meta.url), 'utf8')
    assert.match(src, /role="switch"/)
    assert.match(src, /aria-checked=\{remaining\}/)
  })
  it('restores bookmarks from localStorage', () => {
    const src = readFileSync(new URL('../app/useUsageBookmarks.ts', import.meta.url), 'utf8')
    assert.match(src, /biseo:usage-bookmarks/)
    assert.match(src, /parseUsageBookmarks/)
  })
})