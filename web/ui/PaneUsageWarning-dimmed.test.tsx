import assert from 'node:assert/strict'
import test, { describe } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneUsageWarning } from './PaneUsageWarning'
import { makeTestPane as p } from '../domain/pane-usage-test-helper'

describe('PaneUsageWarning unknown', () => {
  test('renders no icon when usage unknown', () => {
    const provs = [{ provider: 'claude', state: 'unknown' as const, windows: [] }]
    const html = renderToStaticMarkup(<PaneUsageWarning pane={p('claude', 'opus')} providers={provs} />)
    assert.equal(html, '')
  })
})
