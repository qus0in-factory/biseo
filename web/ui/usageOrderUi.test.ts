import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageDashboard } from './UsageDashboard'

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
