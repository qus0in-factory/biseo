import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(`./${f}`, import.meta.url), 'utf8')

describe('UsageModalNav order removal', () => {
  it('keeps hide controls and removes edit/drag', () => {
    assert.match(src('UsageOrderedTabs.tsx'), /UsageOrderSection/)
    const item = src('UsageOrderItem.tsx')
    assert.match(item, /UsageOrderItemActions/)
    const actions = src('UsageOrderItemActions.tsx')
    assert.match(actions, /usageHideItem/)
    assert.match(actions, /usageShowItem/)
    const section = src('UsageOrderSection.tsx')
    assert.doesNotMatch(section, /usageEditOrder/)
    assert.doesNotMatch(section, /draggable/)
  })
})