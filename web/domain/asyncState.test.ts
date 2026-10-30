import assert from 'node:assert/strict'
import test from 'node:test'
import { dataOf, emptyState, errorState, loadingState, readyState } from './asyncState.js'
import { listState } from './asyncListState.js'

test('initial loading has no data and a refresh keeps data', () => {
  const first = loadingState<number[]>()
  assert.equal(first.status, 'loading')
  assert.equal(dataOf(first), undefined)
  const refresh = loadingState(readyState([1]))
  assert.deepEqual(dataOf(refresh), [1])
})

test('success is empty only for an empty list, otherwise ready', () => {
  assert.equal(listState([], false, null).status, 'empty')
  assert.equal(listState([1], false, null).status, 'ready')
})

test('error keeps existing data for stale rendering', () => {
  const failed = errorState('connection_unavailable', readyState([1]))
  assert.equal(failed.status, 'error')
  assert.equal(failed.error, 'connection_unavailable')
  assert.deepEqual(dataOf(failed), [1])
  assert.deepEqual(dataOf(emptyState<number[]>()), undefined)
})
