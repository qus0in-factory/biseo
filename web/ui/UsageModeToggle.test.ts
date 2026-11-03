import { test } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageModeToggle } from './UsageModeToggle'
import { describe } from 'node:test'
import assert from 'node:assert/strict'

describe('UsageModal', () => {
test('remaining switch exposes both states and forwards the toggle callback', () => {
  let toggles = 0
  for (const remaining of [true, false]) {
    const node = UsageModeToggle({ remaining, onToggle() { toggles++ } })
    const out = renderToStaticMarkup(node)
    assert.match(out, new RegExp(`aria-checked="${remaining}"`))
    assert.ok(out.includes(`aria-label="${remaining ? r.usageRemaining : r.usageUsed}"`))
    node.props.onClick()
  }
  assert.equal(toggles, 2)
})

})
