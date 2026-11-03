import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsagePanelRow } from './UsagePanelRow.js'
import import5_test from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import r from '../resources.json'

test('UsagePanelRow renders stale card, prompt, and unconfirmed reset', () => {
  const w = { window: 'm', usedPercent: 45, resetsAt: '2099-01-01T00:00:00Z', checkedAt: '2026-11-02T10:00:00Z', limitReached: false, source: 'grok-stale' }
  const p = { provider: 'grok', state: 'available' as const, reason: 'auth_required', windows: [w] }
  const h1 = renderToStaticMarkup(createElement(UsagePanelRow, { provider: p }))
  assert.match(h1, /border-dashed/)
  assert.match(h1, /Grok 재인증이 필요합니다\./)
  assert.match(h1, /55%/)

  const elapsed = { ...p, windows: [{ ...w, resetsAt: '2020-01-01T00:00:00Z' }] }
  const h2 = renderToStaticMarkup(createElement(UsagePanelRow, { provider: elapsed }))
  assert.match(h2, /미확인/)
  assert.doesNotMatch(h2, /55%/)
})
{
const test = import5_test;
const win = (window: string, checkedAt: string | null) => ({
  window, usedPercent: 50, resetsAt: null, checkedAt, limitReached: false, source: null,
})
const p = (a: string, b: string) => ({
  provider: 'test', state: 'available' as const, windows: [win('a', a), win('b', b)],
})

test('one checked timestamp is shown once at the card bottom when all windows agree', () => {
  const html = render(h(UsagePanelRow, { provider: p('2026-11-03T04:44:21Z', '2026-11-03T04:44:21Z'), groupChecked: true }))
  assert.equal((html.match(new RegExp(`${r.usageChecked}:`, 'g')) ?? []).length, 1)
  assert.match(html, /26-11-03 13:44:21/)
})

test('differing checked timestamps stay on their own rows', () => {
  const html = render(h(UsagePanelRow, { provider: p('2026-11-03T04:44:21Z', '2026-11-03T05:44:21Z'), groupChecked: true }))
  assert.equal((html.match(new RegExp(`${r.usageChecked}:`, 'g')) ?? []).length, 2)
})
}
