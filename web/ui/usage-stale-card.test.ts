import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsagePanelRow } from './UsagePanelRow.js'

test('UsagePanelRow renders stale card, prompt, and unconfirmed reset', () => {
  const w = { window: 'm', usedPercent: 45, resetsAt: '2099-01-01T00:00:00Z', checkedAt: '2026-11-02T10:00:00Z', limitReached: false, source: 'grok-stale' }
  const p = { provider: 'grok', state: 'available' as const, reason: 'auth_required', windows: [w] }
  const h1 = renderToStaticMarkup(createElement(UsagePanelRow, { provider: p }))
  assert.match(h1, /border-dashed/)
  assert.match(h1, /Grok 재인증이 필요합니다\./)
  assert.match(h1, /55%/)

  const elapsed = { ...p, windows: [{ ...w, resetsAt: '2020-01-01T00:00:00Z' }] }
  const h2 = renderToStaticMarkup(createElement(UsagePanelRow, { provider: elapsed }))
  assert.match(h2, /미확인/)
  assert.doesNotMatch(h2, /55%/)
})
