import { test } from 'node:test'
import r from '../resources.json'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageProviderSettings } from './UsageProviderSettings'

const providers = ['agy', 'claude', 'codex'].map((provider) => ({ provider, state: 'available' as const, windows: [] }))

test('provider settings keeps every provider, order controls and icons', () => {
  const html = render(h(UsageProviderSettings, {
    providers, hidden: ['claude'], onMove() {}, onToggle() {}, onShowAll() {}, onClose() {},
  }))
  assert.ok(html.indexOf('agy') < html.indexOf('claude'))
  assert.ok(html.indexOf('claude') < html.indexOf('codex'))
  assert.match(html, /aria-label="agy 길게 눌러 순서를 바꿀 수 있습니다\."/)
  assert.match(html, /lucide-grip-vertical/)
  assert.ok(html.includes(r.usageProviderShowAll))
})

{
const providers = ['agy', 'claude'].map((provider) => ({ provider, state: 'available' as const, windows: [] }))

test('visibility uses the shared switch instead of native checkboxes', () => {
  const html = render(h(UsageProviderSettings, {
    providers, hidden: ['claude'], onMove() {}, onToggle() {}, onShowAll() {}, onClose() {},
  }))
  assert.match(html, /role="switch"[^>]*aria-checked="true"[^>]*aria-label="표시: agy"/)
  assert.match(html, /role="switch"[^>]*aria-checked="false"[^>]*aria-label="표시: claude"/)
  assert.match(html, /lucide-eye/)
  assert.match(html, /lucide-eye-off/)
  assert.doesNotMatch(html, /type="checkbox"/)
})
}
