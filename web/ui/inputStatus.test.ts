import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { PaneStatusBadge } from './PaneStatusBadge'
import { TurnStatusBadge } from './TurnStatusBadge'
test('pane and recorded turn distinguish input from blocked', () => {
  assert.match(render(h(PaneStatusBadge, { status: 'blocked', blockedReason: 'input_request' })), /입력 필요/)
  assert.match(render(h(TurnStatusBadge, { status: 'blocked', errorCode: 'input_request' })), /입력 필요/)
  assert.match(render(h(TurnStatusBadge, { status: 'blocked', errorCode: 'agent_blocked' })), /차단됨/)
})
