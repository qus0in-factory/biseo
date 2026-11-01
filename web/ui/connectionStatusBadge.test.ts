import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ConnectionStatusBadge } from './ConnectionStatusBadge'
import r from '../resources.json'

test('connection badge distinguishes connecting, connected, and dropped states', () => {
  const html = (status: 'connecting' | 'connected' | 'disconnected') =>
    renderToStaticMarkup(createElement(ConnectionStatusBadge, { status }))
  for (const status of ['connecting', 'connected', 'disconnected'] as const) {
    const markup = html(status)
    assert.match(markup, new RegExp(`>${r[status]}<`))
    assert.match(markup, new RegExp(`aria-label="${r[status]}"`))
  }
  assert.match(html('connecting'), /lucide-loader-circle/)
  assert.match(html('disconnected'), /lucide-wifi-off/)
})
