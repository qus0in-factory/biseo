import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BlockedReasonBadge } from './BlockedReasonBadge'
import { PaneAvailability } from './PaneAvailability'
import { PaneSelectButton } from './PaneSelectButton'
import { ReasonDetails } from './ReasonDetails'
import { makeTestPane } from '../domain/pane-usage-test-helper'

test('pane icons render click popovers', () => {
  const a = renderToStaticMarkup(createElement(PaneAvailability, {
    availability: { state: 'limited', source: null, checkedAt: null, resetsAt: null, reason: null, window: null },
  }))
  assert.match(a, /<button[^>]*aria-expanded="false"/)
  assert.doesNotMatch(a, /title=/)
  const b = { ...makeTestPane('codex', 'sol'), status: 'blocked' as const, blockedReason: 'input_request' as const }
  assert.match(renderToStaticMarkup(createElement(BlockedReasonBadge, { item: b })), /승인 또는 입력 대기 중/)
  assert.match(renderToStaticMarkup(createElement(ReasonDetails, { text: '사유' })), /aria-label="사유"/)
  assert.match(renderToStaticMarkup(createElement(PaneSelectButton, { item: b, active: true, onClick() {} })), /^<div role="button"/)
})
