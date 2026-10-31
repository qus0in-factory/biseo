import assert from 'node:assert/strict'
import test, { describe } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneUsageWarning } from './PaneUsageWarning'
import { makeTestPane as pane } from '../domain/pane-usage-test-helper'

describe('PaneUsageWarning threshold', () => {
  test('renders warning icon when threshold reached', () => {
    const provs = [{
      provider: 'claude',
      state: 'available' as const,
      windows: [{ window: 'primary', usedPercent: 92, resetsAt: null, checkedAt: null, limitReached: false, source: null }],
    }]
    const html = renderToStaticMarkup(<PaneUsageWarning pane={pane('claude', 'opus')} providers={provs} />)
    assert.match(html, /role="status"/)
    assert.match(html, /title="사용량 한도 임박: 5h"/)
    assert.match(html, /aria-label="사용량 한도 임박: 5h"/)
    assert.match(html, /text-amber-500/)
    assert.match(html, /<svg/)
  })
})
