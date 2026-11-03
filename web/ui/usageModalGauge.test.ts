import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageModalDisplay } from './UsageModalDisplay'
import { UsageWindowRow } from './UsageWindowRow'
import { percentValue } from './usageRowAssert.test-util'

test('modal adds gauge while preserving warning text, icon and nonmodal display', () => {
  const value = { ...percentValue('2099-01-01T00:00:00Z'), window: '5h', usedPercent: 95 }
  const row = h(UsageWindowRow, { provider: 'claude', value })
  const html = render(h(UsageModalDisplay, { value: true }, row))
  assert.match(html, /aria-valuenow="95"/)
  assert.match(html, /bg-warning/)
  assert.match(html, /lucide-triangle-alert/)
  assert.match(html, /sr-only/)
  assert.match(html, />5%</)
  assert.doesNotMatch(render(row), /progressbar/)
})
