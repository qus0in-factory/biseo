import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { MarkdownToggle } from './MarkdownToggle.js'

test('switch has a localized name and exposes raw state without visible text', () => {
  const label = (r as Record<string, string>).markdownToggleLabel
  assert.ok(label)
  for (const raw of [false, true]) {
    const html = renderToStaticMarkup(createElement(MarkdownToggle, { raw, onToggle: () => {} }))
    assert.match(html, /role="switch"/)
    assert.match(html, new RegExp(`aria-checked="${raw}"`))
    assert.ok(html.includes(`aria-label="${label}"`))
    assert.match(html, /h-11 w-20/)
    assert.ok(html.indexOf('lucide-eye') < html.indexOf('lucide-code-2'))
    assert.equal(html.includes('translate-x-9'), raw)
    assert.equal(html.replace(/<[^>]*>/g, ''), '')
  }
})
