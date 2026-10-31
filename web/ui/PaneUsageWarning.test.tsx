import assert from 'node:assert/strict'
import test, { describe } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { PaneSummary } from '../domain/timeline'
import type { UsageProvider } from '../domain/usage'
import { PaneUsageWarning } from './PaneUsageWarning'

const makePane = (kind: string | null = 'claude'): PaneSummary => ({
  paneId: 'p1',
  tabId: 't1',
  name: 'Opus Worker',
  agentKind: kind,
  agentName: 'opus',
  status: 'idle',
  sendable: true,
  disabledReason: null,
})

describe('PaneUsageWarning', () => {
  test('renders warning icon with tooltip and accessible label when threshold reached', () => {
    const pane = makePane('claude')
    const providers: UsageProvider[] = [
      {
        provider: 'claude',
        state: 'available',
        windows: [{ window: 'primary', usedPercent: 92, resetsAt: null, checkedAt: null, limitReached: false, source: null }],
      },
    ]

    const html = renderToStaticMarkup(<PaneUsageWarning pane={pane} providers={providers} />)
    assert.match(html, /role="status"/)
    assert.match(html, /title="사용량 한도 임박: 5h"/)
    assert.match(html, /aria-label="사용량 한도 임박: 5h"/)
    assert.match(html, /<svg/)
  })

  test('does not render when below threshold', () => {
    const pane = makePane('claude')
    const providers: UsageProvider[] = [
      {
        provider: 'claude',
        state: 'available',
        windows: [{ window: 'primary', usedPercent: 85, resetsAt: null, checkedAt: null, limitReached: false, source: null }],
      },
    ]

    const html = renderToStaticMarkup(<PaneUsageWarning pane={pane} providers={providers} />)
    assert.equal(html, '')
  })

  test('does not render false positive on unknown/null usage (#140, #141)', () => {
    const pane = makePane('claude')
    const providers: UsageProvider[] = [
      {
        provider: 'claude',
        state: 'available',
        windows: [{ window: 'secondary', usedPercent: null, resetsAt: null, checkedAt: null, limitReached: false, source: null }],
      },
    ]

    const html = renderToStaticMarkup(<PaneUsageWarning pane={pane} providers={providers} />)
    assert.equal(html, '')
  })
})
