import test from 'node:test'
import assert from 'node:assert/strict'
import { parseRouteParams } from './routeParams'

// 6bb8c3f removed the tab route param when navigation moved to path routes.
test('parseRouteParams validates paneId and ignores the removed tab param', () => {
  assert.deepEqual(parseRouteParams({ paneId: 'w1T:p2', tab: 'chat' }), {
    paneId: 'w1T:p2',
  })
  assert.deepEqual(parseRouteParams({ paneId: '   ' }), {})
  assert.deepEqual(parseRouteParams({ tab: 'unknown' }), {})
  assert.deepEqual(parseRouteParams(null), {})
})
