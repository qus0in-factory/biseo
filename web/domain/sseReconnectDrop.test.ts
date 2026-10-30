import assert from 'node:assert/strict'
import test from 'node:test'
import { connectTimelineStream } from '../infra/timelineStreamSession.js'
import { makeStreamEnv, FakeEventSource } from './streamReconnectFixture.js'

test('reconnects after connection drop', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const env = makeStreamEnv()
  ;(globalThis as any).window = env.window
  ;(globalThis as any).document = env.document
  ;(globalThis as any).EventSource = FakeEventSource
  FakeEventSource.instances = []
  try {
    const unbind = connectTimelineStream('w', () => {}, () => {}, () => {})
    const first = FakeEventSource.instances[0]
    first.fail()
    assert.equal(first.closed, true)
    t.mock.timers.tick(1100)
    assert.equal(FakeEventSource.instances.length, 2)
    unbind()
  } finally {
    t.mock.timers.reset()
    delete (globalThis as any).window
    delete (globalThis as any).document
    delete (globalThis as any).EventSource
  }
})
