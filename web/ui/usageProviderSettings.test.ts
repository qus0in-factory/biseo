import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageProviderSettings } from './UsageProviderSettings'
import r from '../resources.json'

const providers = ['agy', 'claude', 'codex'].map((provider) => ({ provider, state: 'available' as const, windows: [] }))

test('provider settings keeps every provider, order controls, icons and visibility checks', () => {
  const html = render(h(UsageProviderSettings, {
    providers, hidden: ['claude'], onMove() {}, onToggle() {}, onShowAll() {}, onClose() {},
  }))
  assert.ok(html.indexOf('agy') < html.indexOf('claude'))
  assert.ok(html.indexOf('claude') < html.indexOf('codex'))
  assert.match(html, /aria-label="agy 길게 눌러 순서를 바꿀 수 있습니다\."/)
  assert.match(html, /lucide-grip-vertical/)
  assert.match(html, new RegExp(`aria-label="${r.usageProviderVisible}: agy"`))
  assert.match(html, /aria-label="표시: agy"[^>]*checked=""/)
  assert.doesNotMatch(html, /aria-label="표시: claude"[^>]*checked=""/)
  assert.ok(html.includes(r.usageProviderShowAll))
})
