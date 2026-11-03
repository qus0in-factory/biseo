import assert from 'node:assert/strict'
import test from 'node:test'
import { connectTimelineStream } from './timelineStreamSession.js'
import { makeStreamEnv } from '../test-util/streamReconnectFixture'
import { FakeEventSource } from '../test-util/streamReconnectFixture'
test('closes previous EventSource on cleanup', () => {
  const env = makeStreamEnv()
  ;(globalThis as any).window = env.window
  ;(globalThis as any).document = env.document
  ;(globalThis as any).EventSource = FakeEventSource
  FakeEventSource.instances = []
  const unbind = connectTimelineStream('w', () => {}, () => {}, () => {})
  const first = FakeEventSource.instances[0]
  unbind()
  assert.equal(first.closed, true)
  delete (globalThis as any).window
  delete (globalThis as any).document
  delete (globalThis as any).EventSource
})
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
test('no duplicate EventSource on visible when OPEN', () => {
  const env = makeStreamEnv()
  ;(globalThis as any).window = env.window
  ;(globalThis as any).document = env.document
  ;(globalThis as any).EventSource = FakeEventSource
  FakeEventSource.instances = []
  const unbind = connectTimelineStream('w', () => {}, () => {}, () => {})
  FakeEventSource.instances[0].readyState = FakeEventSource.OPEN
  env.document.visibilityState = 'visible'
  for (const cb of env.docListeners.visibilitychange || []) cb()
  assert.equal(FakeEventSource.instances.length, 1)
  unbind()
  delete (globalThis as any).window
  delete (globalThis as any).document
  delete (globalThis as any).EventSource
})
test('does not reconnect when readyState is OPEN', () => {
  const env = makeStreamEnv()
  ;(globalThis as any).window = env.window
  ;(globalThis as any).document = env.document
  ;(globalThis as any).EventSource = FakeEventSource
  FakeEventSource.instances=[]
  const unbind=connectTimelineStream('w',()=>{},()=>{},()=>{})
  FakeEventSource.instances[0].readyState=FakeEventSource.OPEN
  env.document.visibilityState = 'visible'
  for(const cb of env.docListeners.visibilitychange || []) cb()
  for(const cb of env.winListeners.pageshow || []) cb({ persisted: true })
  for(const cb of env.winListeners.online || []) cb()
  assert.equal(FakeEventSource.instances.length, 1)
  unbind()
  delete (globalThis as any).window
  delete (globalThis as any).document
  delete (globalThis as any).EventSource
})
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
