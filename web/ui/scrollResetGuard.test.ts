import test from 'node:test'
import assert from 'node:assert/strict'
import { runScrollReset } from './scrollReset.js'
import type { TimelineItem } from '../domain/timeline.js'

const item = { requestId: 'r1', status: 'queued' } as TimelineItem

test('no queued turn is a no-op', async () => {
  let calls = 0
  const ran = await runScrollReset([{ ...item, status: 'working' }], {
    cancel: async () => { calls += 1 },
    pull: async () => { calls += 1; return { state: 'imported' } },
  }, { current: false })
  assert.equal(ran, false)
  assert.equal(calls, 0)
})

test('a second call is ignored while the first is in flight', async () => {
  let release!: () => void
  const gate = new Promise<void>((resolve) => { release = resolve })
  let cancels = 0
  let pulls = 0
  const deps = {
    cancel: async () => { cancels += 1; await gate },
    pull: async () => { pulls += 1; return { state: 'imported' } },
  }
  const busy = { current: false }
  const first = runScrollReset([item], deps, busy)
  const second = await runScrollReset([item], deps, busy)
  assert.equal(second, false)
  release()
  assert.equal(await first, true)
  assert.equal(cancels, 1)
  assert.equal(pulls, 1)
})
