import test from 'node:test'
import assert from 'node:assert/strict'
import { paneSelectClass } from './paneSelectClass.js'

test('selected and idle panes use one background each', () => {
  for (const active of [false, true]) {
    const backgrounds = paneSelectClass(active).split(/\s+/).filter((c) => /^bg-(surface|primary\/15)$/.test(c))
    assert.deepEqual(backgrounds, [active ? 'bg-primary/15' : 'bg-surface'])
  }
})
