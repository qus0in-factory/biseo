import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageModalActions } from './UsageModalActions'
import r from '../resources.json'

test('toolbar actions keep labels together and preserve settings semantics', () => {
  const out = render(h(UsageModalActions, {
    retry: async () => {}, loading: true, open: true, onToggle() {},
  }))
  assert.match(out, /^<div class="flex shrink-0 items-center gap-2 whitespace-nowrap">/)
  for (const label of [r.usageRefresh, r.usageProviderSettings]) assert.ok(out.includes(label))
  assert.match(out, /aria-expanded="true"/)
  assert.match(out, /aria-controls="usage-provider-settings"/)
  assert.match(out, /disabled=""/)
})
