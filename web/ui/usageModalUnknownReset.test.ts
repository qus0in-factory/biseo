import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageModalDisplay } from './UsageModalDisplay'
import { UsageWindowRow } from './UsageWindowRow'
import { percentValue } from './usageRowAssert.test-util'
import r from '../resources.json'

test('unknown window values label the schedule as expected', () => {
  const original = Date.now
  Date.now = () => Date.parse('2026-11-03T00:00:00Z')
  try {
    const reset = '2026-11-03T02:00:00Z'
    const value = { ...percentValue(reset), usedPercent: null }
    const html = render(h(UsageModalDisplay, { value: true }, h(UsageWindowRow, { provider: 'codex', value })))
    assert.match(html, new RegExp(r.usageResetExpected))
    assert.match(html, /2시간 후/)
    assert.doesNotMatch(html, />2시간 후</)
  } finally { Date.now = original }
})
