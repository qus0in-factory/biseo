import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageReasonNote } from './UsageReasonNote'
import r from '../resources.json'

test('unknown reason codes fall back to translated text instead of leaking raw codes', () => {
  const html = render(h(UsageReasonNote, { reason: 'mystery_code' }))
  assert.match(html, new RegExp(r.usageReasonUnknown))
  assert.doesNotMatch(html, /mystery_code/)
})
