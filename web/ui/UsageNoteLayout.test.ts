import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsagePanelHeader } from './UsagePanelHeader'
import { UsagePanelNotes } from './UsagePanelNotes'
import type { UsageProvider } from '../domain/usage'

test('normal and cached headers reserve the same non-wrapping hint space', () => {
  const p: UsageProvider = { provider: 'claude', state: 'available', windows: [{
    window: '5h', usedPercent: 10, limitReached: false,
    resetsAt: null, checkedAt: null, source: null,
  }] }
  const header = () => render(h(UsagePanelHeader, { provider: p }))
  const normal = header()
  p.reason = 'rate_limited'
  assert.equal(header().replace(/<span class="absolute.*<\/span>/, ''), normal)
  assert.equal(render(h(UsagePanelNotes, { provider: p })), '')
})
