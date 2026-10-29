import assert from 'node:assert/strict'
import test from 'node:test'
import { connectTimelineStream } from '../infra/timelineStreamSession.js'
import { makeStreamEnv, FakeEventSource } from './streamReconnectFixture.js'

test('reconnects after connection drop', async () => {
  const env = makeStreamEnv()
  ;(globalThis as any).window = env.window
  ;(globalThis as any).document = env.document
  ;(globalThis as any).EventSource = FakeEventSource
  FakeEventSource.instances = []
  const unbind = connectTimelineStream('w', () => {}, () => {}, () => {})
  const first = FakeEventSource.instances[0]
  first.fail()
  assert.equal(first.closed, true)
  await new Promise((r) => setTimeout(r, 1100))
  assert.equal(FakeEventSource.instances.length, 2)
  unbind()
  delete (globalThis as any).window
  delete (globalThis as any).document
  delete (globalThis as any).EventSource
})
