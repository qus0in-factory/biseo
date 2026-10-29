import assert from 'node:assert/strict'
import test from 'node:test'
import { connectTimelineStream } from '../infra/timelineStreamSession.js'
import { makeStreamEnv, FakeEventSource } from './streamReconnectFixture.js'

test('no duplicate EventSource on persisted pageshow when OPEN', () => {
  const env = makeStreamEnv()
  ;(globalThis as any).window = env.window
  ;(globalThis as any).document = env.document
  ;(globalThis as any).EventSource = FakeEventSource
  FakeEventSource.instances = []
  const unbind = connectTimelineStream('w', () => {}, () => {}, () => {})
  FakeEventSource.instances[0].readyState = FakeEventSource.OPEN
  for (const cb of env.winListeners.pageshow || []) cb({ persisted: true })
  assert.equal(FakeEventSource.instances.length, 1)
  unbind()
  delete (globalThis as any).window
  delete (globalThis as any).document
  delete (globalThis as any).EventSource
})
