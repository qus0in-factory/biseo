import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageModalDisplay } from './UsageModalDisplay'
import { UsageWindowTime } from './UsageWindowTime'
import { percentValue } from './usageRowAssert.test-util'

test('modal reset prioritizes relative time while retaining absolute tooltip', () => {
  const now = Date.now
  Date.now = () => Date.parse('2026-11-03T00:00:00Z')
  try {
    const value = percentValue('2026-11-03T00:17:00Z')
    const html = render(h(UsageModalDisplay, { value: true }, h(UsageWindowTime, { value })))
    assert.match(html, /17분 후/)
    assert.match(html, /title="2026-11-03 09:17:00"/)
    assert.doesNotMatch(html, />26-11-03 09:17:00</)
  } finally { Date.now = now }
})
