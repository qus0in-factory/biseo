import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const src = (f: string): string => readFileSync(new URL(f, import.meta.url), 'utf8')

describe('UsageModal provider visibility', () => {
  it('defaults to every provider without bookmark tabs or stars', () => {
    const dash = src('./UsageDashboard.tsx')
    assert.match(dash, /hidden\.includes/)
    assert.match(dash, /UsageDashboardContent/)
    for (const f of ['./UsageDashboard.tsx', './UsagePanelRow.tsx', './UsageProviderSettings.tsx']) {
      assert.doesNotMatch(src(f), /usageBookmark|UsageBookmarkStar|Star/)
    }
    assert.equal(existsSync(new URL('./UsageTabList.tsx', import.meta.url)), false)
    assert.equal(existsSync(new URL('./UsageBookmarkStar.tsx', import.meta.url)), false)
  })
})
