import assert from 'node:assert/strict'
import test, { describe } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneUsageWarning } from './PaneUsageWarning'
import { makeTestPane as p } from '../domain/pane-usage-test-helper'

describe('PaneUsageWarning normal', () => {
  test('does not render when below threshold', () => {
    const provs = [{
      provider: 'claude',
      state: 'available' as const,
      windows: [{ window: 'primary', usedPercent: 85, resetsAt: null, checkedAt: null, limitReached: false, source: null }],
    }]
    assert.equal(renderToStaticMarkup(<PaneUsageWarning pane={p('claude', 'opus')} providers={provs} />), '')
  })
})
