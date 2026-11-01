import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageWindowRow } from './UsageWindowRow.js'
import r from '../resources.json'

const DAY = 86_400_000
const fromNow = (days: number) => new Date(Date.now() + days * DAY).toISOString()
const label = (r as Record<string, string>).usageTimeLeft
const value = {
  window: 'secondary',
  usedPercent: 50,
  resetsAt: fromNow(3.5),
  checkedAt: null,
  limitReached: false,
  source: null,
}

test('window rows use the displayed w label', () => {
  const html = renderToStaticMarkup(createElement(UsageWindowRow, { provider: 'codex', value }))
  assert.match(html, new RegExp(`${label} 50%`))
})

test('unknown resets do not show a remaining time', () => {
  const html = renderToStaticMarkup(
    createElement(UsageWindowRow, { provider: 'codex', value: { ...value, resetsAt: null } }),
  )
  assert.doesNotMatch(html, new RegExp(label))
})
