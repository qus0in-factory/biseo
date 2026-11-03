import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageModeRow } from './UsageModeRow'
import assert from 'node:assert/strict'

test('mode row renders each mode label only once', () => {
  const out = renderToStaticMarkup(createElement(UsageModeRow, { remaining: true, onToggle() {} }))
  for (const label of [r.usageRemaining, r.usageUsed]) {
    assert.equal((out.match(new RegExp(`>${label}<`, 'g')) ?? []).length, 1)
  }
})
