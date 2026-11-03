import { test } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { RecentPullButton } from './RecentPullButton'
import { recentPullFixture } from '../test-util/recentPull'
import assert from 'node:assert/strict'

test('recent pull button exposes its label and forwards only its pull action', () => {
  let calls = 0
  for (const pending of [false, true]) {
    const pull = recentPullFixture('idle', () => { calls++ }, pending)
    const node = RecentPullButton({ pull })
    const out = renderToStaticMarkup(node)
    assert.ok(out.includes(`aria-label="${r.recentPull}"`))
    assert.equal(node.props.disabled, pending)
    if (!pending) node.props.onClick()
  }
  assert.equal(calls, 1)
})
