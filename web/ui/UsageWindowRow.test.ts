import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageWindowRow } from './UsageWindowRow'
import { assertFixedValueColumns } from '../test-util/usageRowAssert'
import { fromNow } from '../test-util/usageRowAssert'
import { percentValue } from '../test-util/usageRowAssert'
import r from '../resources.json'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageModalDisplay } from './UsageModalDisplay'
import { expectNoTimeIcon } from '../test-util/usageTimeLeftExpect'
import { expectTimeIcon } from '../test-util/usageTimeLeftExpect'
import { test as import14_test } from 'node:test'
const label=(r as Record<string,string>).usageTimeLeft
test('window rows share the same fixed value columns',()=>{
 const withTime=renderToStaticMarkup(createElement(UsageWindowRow,{provider:'codex',value:percentValue(fromNow(3.5))}))
 const withoutTime=renderToStaticMarkup(createElement(UsageWindowRow,{provider:'codex',value:percentValue(null)}))
 assertFixedValueColumns(withTime)
 assertFixedValueColumns(withoutTime)
 assert.match(withTime,new RegExp(`aria-label="${label}"`))
 assert.doesNotMatch(withoutTime,new RegExp(`aria-label="${label}"`))
})
test('modal gauge follows the displayed remaining number while warning stays used-based', () => {
  const value = { ...percentValue('2099-01-01T00:00:00Z'), window: '5h', usedPercent: 95 }
  const row = h(UsageWindowRow, { provider: 'claude', value })
  const html = render(h(UsageModalDisplay, { value: true }, row))
  assert.match(html, /aria-valuenow="5"/)
  assert.match(html, new RegExp(`aria-label="${r.usageRemaining}"`))
  assert.match(html, /width:5%/)
  assert.match(html, /bg-warning/)
  assert.match(html, /lucide-triangle-alert/)
  assert.match(html, /sr-only/)
  assert.match(html, />5%</)
  assert.doesNotMatch(render(row), /progressbar/)
})
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
{
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
  expectTimeIcon(html, label, 50)
})

test('unknown resets do not show a remaining time', () => {
  const html = renderToStaticMarkup(
    createElement(UsageWindowRow, { provider: 'codex', value: { ...value, resetsAt: null } }),
  )
  expectNoTimeIcon(html, label)
})
}
{
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
}
{
const test = import14_test;
test('explicit window limit has a non-color label', () => {
  const value = { window: 'primary', usedPercent: null, resetsAt: null,
    checkedAt: null, limitReached: true, source: null }
  const html = renderToStaticMarkup(createElement(UsageWindowRow, { provider: 'test', value }))
  assert.match(html, /text-danger/)
  assert.doesNotMatch(html, /text-error/)
  assert.match(html, /py-1\.5/)
  assert.doesNotMatch(html, /border-t|border-border/)
  assert.match(html, /sr-only[^>]*>한도 도달/)
})
}
