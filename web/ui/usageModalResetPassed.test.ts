import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageModalDisplay } from './UsageModalDisplay'
import { UsageWindowRow } from './UsageWindowRow'
import { percentValue } from './usageRowAssert.test-util'
import r from '../resources.json'

test('reset labels for values past their reset time say the time has passed', () => {
  const original = Date.now
  Date.now = () => Date.parse('2026-11-03T00:00:00Z')
  try {
    const value = { ...percentValue('2026-11-02T22:00:00Z'), usedPercent: null }
    const html = render(h(UsageModalDisplay, { value: true }, h(UsageWindowRow, { provider: 'codex', value })))
    assert.match(html, new RegExp(r.usageResetPassed))
    assert.doesNotMatch(html, new RegExp(r.usageResetExpected))
  } finally { Date.now = original }
})
