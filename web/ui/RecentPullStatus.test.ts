import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { RecentPullStatus } from './RecentPullStatus'
import { recentPullFixture } from '../test-util/recentPull'
import assert from 'node:assert/strict'

test('recent pull announces pending failure and success outcomes', () => {
  const pending = renderToStaticMarkup(createElement(RecentPullStatus, { pull: recentPullFixture('pending') }))
  assert.match(pending, /role="status"/)
  assert.ok(pending.includes(r.recentLoading))
  const failed = renderToStaticMarkup(createElement(RecentPullStatus, { pull: recentPullFixture('error') }))
  assert.match(failed, /role="alert"/)
  assert.ok(failed.includes(r.recentError))
  const success = renderToStaticMarkup(createElement(RecentPullStatus, { pull: recentPullFixture('success') }))
  assert.match(success, /role="status"/)
  assert.ok(success.includes(r.recent_imported))
})
