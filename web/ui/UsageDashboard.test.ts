import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageDashboard } from './UsageDashboard'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageModalDisplay } from './UsageModalDisplay'

test('dashboard renders the cache notice for claude cache readings', () => {
  const provider = { provider: 'claude', source: 'claude-cache', state: 'available' as const, windows: [{
    window: '5h', usedPercent: 10, resetsAt: null, checkedAt: null, limitReached: false, source: 'claude-cache',
  }] }
  const out = renderToStaticMarkup(createElement(UsageDashboard, { providers: [provider] }))
  assert.ok(out.includes(r.usageStale))
})

const at = '2026-11-03T04:44:21.933Z'
const win = (window: string, usedPercent: number) => ({
  window, usedPercent, resetsAt: null, checkedAt: at, limitReached: false, source: null,
})
const providers = [
  { provider: 'agy', state: 'available' as const, windows: ['a1', 'a2', 'a3', 'a4', 'a5'].map((w, i) => win(w, 15 + i * 16)) },
  { provider: 'claude', state: 'available' as const, windows: [win('5h', 42), win('7d', 68)] },
]

test('dashboard shows all providers and every window without bookmark navigation', () => {
  const html = render(h(UsageModalDisplay, { value: true }, h(UsageDashboard, { providers })))
  for (const p of providers) assert.ok(html.includes(p.provider))
  for (const w of providers[0].windows) assert.ok(html.includes(w.window))
  assert.equal((html.match(/role="progressbar"/g) ?? []).length, 7)
  assert.doesNotMatch(html, /북마크|role="tab"|lucide-star/)
})
test('unknown providers keep a translated reason without a gauge or raw code', () => {
  const provider = {
    provider: 'codex', state: 'unknown' as const, reason: 'usage_unavailable',
    windows: [{ window: '5h', usedPercent: null, resetsAt: null, checkedAt: null, limitReached: false, source: null }],
  }
  const html = render(h(UsageModalDisplay, { value: true }, h(UsageDashboard, { providers: [provider], remaining: true })))
  assert.match(html, new RegExp(r.usage_unavailable))
  assert.doesNotMatch(html, /usage_unavailable/)
  assert.doesNotMatch(html, /role="progressbar"/)
})
const p = (provider: string) => ({ provider, state: 'available' as const, windows: [] })

test('dashboard renders every provider in source order without a bookmark tab', () => {
  const html = renderToStaticMarkup(createElement(UsageDashboard, {
    providers: [p('ollama'), p('claude'), p('agy')],
    remaining: true,
  }))
  assert.ok(html.indexOf('ollama') < html.indexOf('claude'))
  assert.ok(html.indexOf('claude') < html.indexOf('agy'))
  assert.doesNotMatch(html, /북마크|role="tab"|lucide-star/)
})
