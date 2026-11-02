import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(`./${f}`, import.meta.url), 'utf8')

describe('UsageModalNav', () => {
  it('keeps provider tabs in a single-line sortable strip without arrows', () => {
    const list = src('UsageTabList.tsx')
    assert.match(list, /value="bookmarked"/)
    assert.match(list, /flex-nowrap/)
    assert.match(list, /overflow-x-auto/)
    assert.match(list, /SortableList/)
    assert.doesNotMatch(list, /usageTabPrev|usageTabNext/)
    const strip = src('UsageTabStrip.tsx')
    assert.doesNotMatch(strip, /usageTabPrev|usageTabNext|step/)
  })
})
