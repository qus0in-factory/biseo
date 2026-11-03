import assert from 'node:assert/strict'
import test from 'node:test'
import { describe } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneUsageWarning } from './PaneUsageWarning'
import { makeTestPane as p } from '../test-util/pane-usage-test-helper'
import { makeTestPane } from '../test-util/pane-usage-test-helper'

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
describe('PaneUsageWarning unknown', () => {
  test('renders no icon when usage unknown', () => {
    const provs = [{ provider: 'claude', state: 'unknown' as const, windows: [] }]
    const html = renderToStaticMarkup(<PaneUsageWarning pane={p('claude', 'opus')} providers={provs} />)
    assert.equal(html, '')
  })
})
describe('PaneUsageWarning threshold', () => {
  test('renders warning icon popover trigger when threshold reached', () => {
    const provs = [{
      provider: 'claude',
      state: 'available' as const,
      windows: [{ window: 'primary', usedPercent: 92, resetsAt: null, checkedAt: null, limitReached: false, source: null }],
    }]
    const html = renderToStaticMarkup(<PaneUsageWarning pane={makeTestPane('claude', 'opus')} providers={provs} />)
    assert.match(html, /role="status"/)
    assert.match(html, /<button[^>]*type="button"/)
    assert.match(html, /aria-label="사용량 한도 임박: 5h"/)
    assert.match(html, /aria-expanded="false"/)
    assert.doesNotMatch(html, /title=/)
    assert.match(html, /text-amber-500/)
  })
})
