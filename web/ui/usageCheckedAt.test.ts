import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsagePanelRow } from './UsagePanelRow'
import r from '../resources.json'

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
