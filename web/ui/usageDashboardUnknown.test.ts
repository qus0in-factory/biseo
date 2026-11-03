import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageDashboard } from './UsageDashboard'
import { UsageModalDisplay } from './UsageModalDisplay'
import r from '../resources.json'

test('unknown providers keep a translated reason without a gauge or raw code', () => {
  const provider = {
    provider: 'codex', state: 'unknown' as const, reason: 'usage_unavailable',
    windows: [{ window: '5h', usedPercent: null, resetsAt: null, checkedAt: null, limitReached: false, source: null }],
  }
  const html = render(h(UsageModalDisplay, { value: true }, h(UsageDashboard, { providers: [provider], remaining: true })))
  assert.match(html, new RegExp(r.usage_unavailable))
  assert.doesNotMatch(html, /usage_unavailable/)
  assert.doesNotMatch(html, /role="progressbar"/)
})
