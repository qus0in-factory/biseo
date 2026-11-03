import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageProviderSettings } from './UsageProviderSettings'

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
