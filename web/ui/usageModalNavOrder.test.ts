import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(`./${f}`, import.meta.url), 'utf8')

describe('UsageModalNav order edit', () => {
  it('exposes order edit and hide controls', () => {
    assert.match(src('UsageOrderedTabs.tsx'), /UsageOrderSection/)
    assert.match(src('UsageOrderSection.tsx'), /usageEditOrder/)
    assert.match(src('UsageOrderSection.tsx'), /UsageOrderEditList/)
    assert.match(src('UsageOrderEditList.tsx'), /draggable/)
    const item = src('UsageOrderItem.tsx')
    assert.match(item, /UsageOrderItemActions/)
    const actions = src('UsageOrderItemActions.tsx')
    assert.match(actions, /usageHideItem/)
    assert.match(actions, /usageShowItem/)
  })
})
