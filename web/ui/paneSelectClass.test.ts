import assert from 'node:assert/strict'
import test from 'node:test'
import { paneSelectClass } from './paneSelectClass'
import { paneSelectTarget } from './paneSelectClass'
test('flat pane rows use selection and hover fills, reserving outlines for focus', () => {
  assert.match(paneSelectClass(true), /bg-muted/)
  assert.match(paneSelectClass(false), /hover:bg-muted\/50/)
  for (const active of [true, false]) {
    assert.doesNotMatch(paneSelectClass(active), /\bborder\b|\bring\b|\boutline\b/)
    assert.match(paneSelectClass(active), /h-16/)
  }
  assert.match(paneSelectTarget, /focus-visible:outline-2/)
})
test('selected and idle panes use one background each', () => {
  for (const active of [false, true]) {
    const backgrounds = paneSelectClass(active).split(/\s+/).filter((c) => /^(hover:)?bg-/.test(c))
    assert.deepEqual(backgrounds, [active ? 'bg-muted' : 'hover:bg-muted/50'])
  }
})
