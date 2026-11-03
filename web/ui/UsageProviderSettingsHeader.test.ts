import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageProviderSettingsHeader } from './UsageProviderSettingsHeader'
import assert from 'node:assert/strict'

test('provider settings displays its localized guidance', () => {
  const out = renderToStaticMarkup(createElement(UsageProviderSettingsHeader, { onClose() {} }))
  assert.ok(out.includes(r.usageProviderSettingsHint))
  assert.ok(out.includes(r.usageProviderSettings))
  assert.ok(out.includes(r.close))
})
