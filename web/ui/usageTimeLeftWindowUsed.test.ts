import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageWindowRow } from './UsageWindowRow.js'
import { expectTimeIcon } from './usageTimeLeftExpect.js'
import r from '../resources.json'

const DAY = 86_400_000
const fromNow = (days: number) => new Date(Date.now() + days * DAY).toISOString()
const elapsed = (r as Record<string, string>).usageTimeElapsed
const value = {
  window: 'secondary',
  usedPercent: 48,
  resetsAt: fromNow(5.25),
  checkedAt: null,
  limitReached: false,
  source: null,
}

test('window rows show elapsed time in the used view', () => {
  const html = renderToStaticMarkup(
    createElement(UsageWindowRow, { provider: 'codex', value, remaining: false }),
  )
  expectTimeIcon(html, elapsed, 25)
})
