import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(`./${f}`, import.meta.url), 'utf8')

describe('UsageOrderSection toggle flow', () => {
  it('keeps per-item hide/show toggle', () => {
    const item = src('UsageOrderItem.tsx')
    assert.match(item, /onToggleHide/)
    const actions = src('UsageOrderItemActions.tsx')
    assert.match(actions, /usageHideItem/)
    assert.match(actions, /usageShowItem/)
  })
})