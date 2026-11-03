import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageAuthNotice } from './UsageAuthNotice'
import type { UsageProvider } from '../domain/usage'

test('reauth notice uses the accessible danger token', () => {
  const provider: UsageProvider = { provider: 'grok', state: 'available', reason: 'auth_required', windows: [] }
  const html = renderToStaticMarkup(createElement(UsageAuthNotice, { provider }))
  assert.match(html, /text-danger/)
  assert.doesNotMatch(html, /text-error/)
})
