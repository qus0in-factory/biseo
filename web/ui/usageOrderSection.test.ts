import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(`./${f}`, import.meta.url), 'utf8')

describe('UsageOrderSection edit flow', () => {
  it('reorders by drag and commits/cancels draft', () => {
    const s = src('UsageOrderSection.tsx')
    assert.match(s, /draggable/)
    assert.match(s, /onDragStart/)
    assert.match(s, /onDragOver/)
    assert.match(s, /moveUsageIdTo/)
    assert.match(s, /orderState\.setOrder\(d\)/)
    assert.match(s, /setE\(false\)/)
  })
  it('keeps per-item hide/show toggle in edit list', () => {
    const s = src('UsageOrderSection.tsx')
    assert.match(s, /UsageOrderItem/)
    assert.match(s, /toggleHide/)
    const item = src('UsageOrderItem.tsx')
    assert.match(item, /usageHideItem/)
    assert.match(item, /usageShowItem/)
    assert.match(item, /onToggleHide/)
  })
})
