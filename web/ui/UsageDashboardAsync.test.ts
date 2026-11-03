import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageDashboardAsync } from './UsageDashboardAsync'
import assert from 'node:assert/strict'

test('usage dashboard shows empty text only after loading completes', () => {
  const props = { retry() {}, remaining: true, settingsOpen: false, onSettingsOpenChange() {} }
  const loading = renderToStaticMarkup(createElement(UsageDashboardAsync, { ...props, state: { status: 'loading' } }))
  assert.match(loading, /aria-busy="true"/)
  assert.ok(!loading.includes(r.usageEmpty))
  const empty = renderToStaticMarkup(createElement(UsageDashboardAsync, { ...props, state: { status: 'empty' } }))
  assert.ok(empty.includes(r.usageEmpty))
  const failed = renderToStaticMarkup(createElement(UsageDashboardAsync, { ...props, state: { status: 'error', error: 'offline' } }))
  assert.ok(failed.includes(r.usageError))
  assert.ok(failed.includes(r.retry))
  assert.ok(!failed.includes(r.usageEmpty))
})
