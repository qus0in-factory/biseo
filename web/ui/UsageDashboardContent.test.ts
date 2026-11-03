import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageDashboardContent } from './UsageDashboardContent'
import r from '../resources.json'

test('hiding every provider leaves an empty notice and a settings entry point', () => {
  const html = render(h(UsageDashboardContent, { providers: [], remaining: true, onOpenSettings() {} }))
  assert.match(html, new RegExp(r.usageProviderEmpty))
  assert.match(html, new RegExp(`>${r.usageProviderSettings}<`))
})
