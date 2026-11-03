import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageDashboard } from './UsageDashboard'
import { UsageModalDisplay } from './UsageModalDisplay'

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
