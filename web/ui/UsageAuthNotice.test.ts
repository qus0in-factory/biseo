import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageAuthNotice } from './UsageAuthNotice'
import assert from 'node:assert/strict'

test('reauth notice renders the provider reauthentication instruction', () => {
  const provider = { provider: 'grok', state: 'available' as const, reason: 'auth_required', windows: [] }
  const out = renderToStaticMarkup(createElement(UsageAuthNotice, { provider }))
  assert.ok(out.includes(r.usageReauth_grok))
  assert.doesNotMatch(out, /auth_required/)
})
