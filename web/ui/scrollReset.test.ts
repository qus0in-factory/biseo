import test from 'node:test'
import assert from 'node:assert/strict'
import { runScrollReset, shouldResetScroll } from './scrollReset.js'
import type { TimelineItem } from '../domain/timeline.js'

const item = (status: TimelineItem['status'], requestId = 'r1') =>
  ({ requestId, status } as TimelineItem)
const deps = (calls: string[]) => ({
  cancel: async (id: string) => { calls.push(id) },
  pull: async () => (calls.push('pull'), { state: 'imported' }),
})

test('only a user transition from above to bottom triggers', () => {
  assert.equal(shouldResetScroll(false, true, false), true)
  assert.equal(shouldResetScroll(false, true, true), false)
  assert.equal(shouldResetScroll(true, true, false), false)
  assert.equal(shouldResetScroll(true, false, false), false)
})

test('cancels queued turns then pulls once', async () => {
  const calls: string[] = []
  const ran = await runScrollReset(
    [item('queued', 'r1'), item('working', 'r2'), item('queued', 'r3')],
    deps(calls),
    { current: false },
  )
  assert.equal(ran, true)
  assert.deepEqual(calls, ['r1', 'r3', 'pull'])
})
