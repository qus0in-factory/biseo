import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(`./${f}`, import.meta.url), 'utf8')

describe('UsageModalNav', () => {
  it('keeps bookmark tab in a single-line strip with prev/next', () => {
    const list = src('UsageTabList.tsx')
    assert.match(list, /value="bookmarked"/)
    assert.match(list, /flex-nowrap/)
    assert.match(list, /overflow-x-auto/)
    const strip = src('UsageTabStrip.tsx')
    assert.match(strip, /usageTabPrev/)
    assert.match(strip, /usageTabNext/)
  })
})