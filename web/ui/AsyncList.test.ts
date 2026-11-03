import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { AsyncList } from './AsyncList'
import assert from 'node:assert/strict'

test('async list renders loading and empty states without invoking ready content', () => {
  let calls = 0
  const props = { empty: 'EMPTY', errorText: 'ERROR', children: () => { calls++; return 'READY' } }
  const loading = renderToStaticMarkup(createElement(AsyncList, { ...props, state: { status: 'loading' } }))
  assert.match(loading, /role="status"/)
  assert.match(loading, /aria-busy="true"/)
  assert.ok(!loading.includes('EMPTY'))
  const empty = renderToStaticMarkup(createElement(AsyncList, { ...props, state: { status: 'empty' } }))
  assert.ok(empty.includes('EMPTY'))
  assert.equal(calls, 0)
})
