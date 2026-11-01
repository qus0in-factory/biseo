import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveTargetName } from './targetName.js'

const pane = { paneId: 'w1X:p1', name: 'opus' }

test('a saved pane id resolves to the current pane name', () => {
  assert.equal(resolveTargetName({ paneId: 'w1X:p1', targetName: 'w1X:p1' }, [pane]), 'opus')
})

test('a saved name wins over the current pane name', () => {
  assert.equal(resolveTargetName({ paneId: 'w1X:p1', targetName: 'old-name' }, [pane]), 'old-name')
})

test('a missing pane keeps the saved name', () => {
  assert.equal(resolveTargetName({ paneId: 'w1X:p9', targetName: 'w1X:p9' }, [pane]), 'w1X:p9')
})

test('an empty saved name falls back to the current pane name', () => {
  assert.equal(resolveTargetName({ paneId: 'w1X:p1', targetName: '' }, [pane]), 'opus')
})
