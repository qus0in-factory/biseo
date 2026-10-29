import test from 'node:test'
import assert from 'node:assert/strict'
import { parseRouteParams } from './routeParams'

test('parseRouteParams validates paneId and tab', () => {
  assert.deepEqual(parseRouteParams({ paneId: 'w1T:p2', tab: 'chat' }), {
    paneId: 'w1T:p2',
    tab: 'chat',
  })
  assert.deepEqual(parseRouteParams({ paneId: '   ' }), {})
  assert.deepEqual(parseRouteParams({ tab: 'unknown' }), {})
  assert.deepEqual(parseRouteParams(null), {})
})
