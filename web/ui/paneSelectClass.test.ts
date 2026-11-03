import test from 'node:test'
import assert from 'node:assert/strict'
import { paneSelectClass } from './paneSelectClass.js'

test('selected and idle panes use one background each', () => {
  for (const active of [false, true]) {
    const backgrounds = paneSelectClass(active).split(/\s+/).filter((c) => /^(hover:)?bg-/.test(c))
    assert.deepEqual(backgrounds, [active ? 'bg-muted' : 'hover:bg-muted/50'])
  }
})
