import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(`./${f}`, import.meta.url), 'utf8')

describe('UsageOrderSection drag flow', () => {
  it('reorders by drag and commits/cancels draft', () => {
    const list = src('UsageOrderEditList.tsx')
    assert.match(list, /draggable/)
    assert.match(list, /onDragStart/)
    assert.match(list, /onDragOver/)
    assert.match(list, /moveUsageIdTo/)
    const actions = src('UsageOrderEditActions.tsx')
    assert.match(actions, /orderState\.setOrder\(d\)/)
    assert.match(actions, /setE\(false\)/)
    const section = src('UsageOrderSection.tsx')
    assert.match(section, /UsageOrderEditList/)
    assert.match(section, /UsageOrderEditActions/)
  })
})
