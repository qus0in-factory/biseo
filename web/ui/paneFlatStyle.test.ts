import assert from 'node:assert/strict'
import test from 'node:test'
import { paneSelectClass, paneSelectTarget } from './paneSelectClass'

test('flat pane rows use selection and hover fills, reserving outlines for focus', () => {
  assert.match(paneSelectClass(true), /bg-muted/)
  assert.match(paneSelectClass(false), /hover:bg-muted\/50/)
  for (const active of [true, false]) {
    assert.doesNotMatch(paneSelectClass(active), /\bborder\b|\bring\b|\boutline\b/)
    assert.match(paneSelectClass(active), /h-16/)
  }
  assert.match(paneSelectTarget, /focus-visible:outline-2/)
})
