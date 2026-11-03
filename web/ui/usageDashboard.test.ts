import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageDashboard } from './UsageDashboard'
import { UsageModalDisplay } from './UsageModalDisplay'
import r from '../resources.json'
import { describe } from 'node:test'
import { it } from 'node:test'
import { existsSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
const src = (f: string): string => readFileSync(new URL(f, import.meta.url), 'utf8')

test('the live modal path renders the claude cache note', () => {
  const dash = src('./UsageDashboardContent.tsx')
  assert.match(dash, /UsagePanelRow/)
  assert.match(dash, /providers\.map/)
  const fields = src('./UsagePanelFields.tsx')
  assert.match(fields, /UsageCacheNote/)
  assert.match(fields, /<UsageCacheNote provider=\{provider\} \/>/)
  const note = src('./UsageCacheNote.tsx')
  assert.match(note, /cacheNote/)
})

test('the cache note marks only claude-cache readings', () => {
  const lib = src('../domain/usage-cache.ts')
  assert.match(lib, /provider !== 'claude'/)
  assert.match(lib, /claude-cache/)
  assert.match(lib, /usageStale/)
  assert.match(lib, /usageLastSuccess/)
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
{
const src = (f: string): string => readFileSync(new URL(f, import.meta.url), 'utf8')

describe('UsageModal provider visibility', () => {
  it('defaults to every provider without bookmark tabs or stars', () => {
    const dash = src('./UsageDashboard.tsx')
    assert.match(dash, /hidden\.includes/)
    assert.match(dash, /UsageDashboardContent/)
    for (const f of ['./UsageDashboard.tsx', './UsagePanelRow.tsx', './UsageProviderSettings.tsx']) {
      assert.doesNotMatch(src(f), /usageBookmark|UsageBookmarkStar|Star/)
    }
    assert.equal(existsSync(new URL('./UsageTabList.tsx', import.meta.url)), false)
    assert.equal(existsSync(new URL('./UsageBookmarkStar.tsx', import.meta.url)), false)
  })
})
}
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
