import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parsePaneListExpanded, selectCollapsedPanes } from './collapsedPanes.js'

test('folding caps at three; expanding restores all panes without mutating order', () => {
  const panes = ['a', 'b', 'c', 'd', 'e']
  assert.deepEqual(selectCollapsedPanes(panes), ['a', 'b', 'c'])
  assert.deepEqual(selectCollapsedPanes(panes, true), panes)
  assert.deepEqual(selectCollapsedPanes(['a']), ['a'])
  assert.deepEqual(selectCollapsedPanes([]), [])
  assert.equal(panes.length, 5)
})

test('only persisted true expands; legacy counts and corrupt values fold', () => {
  assert.equal(parsePaneListExpanded('true'), true)
  for (const value of [null, 'false', '3', '', 'broken']) {
    assert.equal(parsePaneListExpanded(value), false)
  }
})
