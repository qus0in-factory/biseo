import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { importWithoutStyles } from '../test-util/importWithoutStyles'
import assert from 'node:assert/strict'

const { AppHeader: AppHeader } = await importWithoutStyles(() => import('./AppHeader'))
test('header renders the brand and authenticated logout control', () => {
  const out = renderToStaticMarkup(createElement(AppHeader, { authed: true, onLogout() {} }))
  assert.ok(out.includes(r.title))
  assert.match(out, /src="\/favicon.svg"/)
  assert.ok(out.includes(`aria-label="${r.logout}"`))
  assert.ok(!renderToStaticMarkup(createElement(AppHeader, {})).includes(`aria-label="${r.logout}"`))
})
{
test('connection status and usage control retain accessible labels', () => {
  for (const status of ['connecting', 'connected', 'disconnected'] as const) {
    const out = renderToStaticMarkup(createElement(AppHeader, { authed: true, connection: status }))
    assert.match(out, /role="status"/)
    assert.ok(out.includes(`aria-label="${r[status]}"`))
    assert.ok(out.includes(`>${r[status]}<`))
    assert.ok(out.includes(`aria-label="${r.usageTab}"`))
  }
})

}
