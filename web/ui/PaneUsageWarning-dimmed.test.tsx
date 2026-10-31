import assert from 'node:assert/strict'
import test, { describe } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneUsageWarning } from './PaneUsageWarning'
import { makeTestPane as p } from '../domain/pane-usage-test-helper'

describe('PaneUsageWarning dimmed', () => {
  test('renders dimmed icon when usage unknown', () => {
    const provs = [{ provider: 'claude', state: 'unknown' as const, windows: [] }]
    const html = renderToStaticMarkup(<PaneUsageWarning pane={p('claude', 'opus')} providers={provs} />)
    assert.match(html, /role="status"/)
    assert.match(html, /title="사용량 미확인"/)
    assert.match(html, /opacity-40/)
    assert.match(html, /<svg/)
  })
})
