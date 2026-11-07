import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsagePanelNotes } from './UsagePanelNotes'
import { UsageNoteHint } from './UsageNoteHint'
import type { UsageProvider } from '../domain/usage'
import r from '../resources.json'

test('snapshot notes leave card flow; missing snapshots retain errors', () => {
  const p: UsageProvider = { provider: 'claude', state: 'available', windows: [], reason: 'rate_limited' }
  assert.ok(render(h(UsagePanelNotes, { provider: p })).includes(r.usageReasonRateLimited))
  p.windows = [{ window: '5h', usedPercent: 0, limitReached: false,
    resetsAt: null, checkedAt: null, source: 'claude-stale' }]
  assert.equal(render(h(UsagePanelNotes, { provider: p })), '')
  const hint = render(h(UsageNoteHint, { provider: p }))
  for (const text of [r.usageReasonRateLimited, r.usageStale, 'absolute']) assert.ok(hint.includes(text))
})
