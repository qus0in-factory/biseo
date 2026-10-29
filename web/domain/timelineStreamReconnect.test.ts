import assert from 'node:assert/strict'
import test from 'node:test'
import { connectTimelineStream } from '../infra/timelineStreamSession.js'
import { makeStreamEnv } from './streamLifecycleEnv.js'

class FakeEventSource {
  static instances: FakeEventSource[] = []
  static CONNECTING = 0
  static OPEN = 1
  static CLOSED = 2
  readyState = FakeEventSource.CONNECTING
  closed = false
  onopen: ((e?: any) => void) | null = null
  onerror: ((e?: any) => void) | null = null
  private listeners: Record<string, Array<(e: any) => void>> = {}
  url: string
  init: any
  constructor(url: string, init?: any) {
    this.url = url
    this.init = init
    FakeEventSource.instances.push(this)
  }
  addEventListener(type: string, cb: (e: any) => void) {
    (this.listeners[type] ||= []).push(cb)
  }
  removeEventListener(type: string, cb: (e: any) => void) {
    this.listeners[type] = (this.listeners[type] || []).filter((x) => x !== cb)
  }
  close() {
    this.closed = true
    this.readyState = FakeEventSource.CLOSED
  }
  open() {
    this.readyState = FakeEventSource.OPEN
    this.onopen?.()
  }
  fail() {
    this.onerror?.()
  }
  emit(type: string, data: any) {
    for (const cb of this.listeners[type] || []) cb({ data: JSON.stringify(data) })
  }
}

test('reconnects after connection drop', async () => {
  const env = makeStreamEnv()
  ;(globalThis as any).window = env.window
  ;(globalThis as any).document = env.document
  ;(globalThis as any).EventSource = FakeEventSource
  FakeEventSource.instances = []

  const unbind = connectTimelineStream('ws-1', () => {}, () => {}, () => {})
  const first = FakeEventSource.instances[0]
  assert.equal(FakeEventSource.instances.length, 1)

  first.fail()
  assert.equal(first.closed, true)

  await new Promise((resolve) => setTimeout(resolve, 1100))
  assert.equal(FakeEventSource.instances.length, 2)

  unbind()
  delete (globalThis as any).window
  delete (globalThis as any).document
  delete (globalThis as any).EventSource
})

test('does not create duplicate EventSource on visible when OPEN', () => {
  const env = makeStreamEnv()
  ;(globalThis as any).window = env.window
  ;(globalThis as any).document = env.document
  ;(globalThis as any).EventSource = FakeEventSource
  FakeEventSource.instances = []

  const unbind = connectTimelineStream('ws-1', () => {}, () => {}, () => {})
  const first = FakeEventSource.instances[0]
  first.readyState = FakeEventSource.OPEN

  env.document.visibilityState = 'visible'
  for (const cb of env.docListeners.visibilitychange || []) cb()
  assert.equal(FakeEventSource.instances.length, 1)

  unbind()
  delete (globalThis as any).window
  delete (globalThis as any).document
  delete (globalThis as any).EventSource
})

test('does not create duplicate EventSource on persisted pageshow when OPEN', () => {
  const env = makeStreamEnv()
  ;(globalThis as any).window = env.window
  ;(globalThis as any).document = env.document
  ;(globalThis as any).EventSource = FakeEventSource
  FakeEventSource.instances = []

  const unbind = connectTimelineStream('ws-1', () => {}, () => {}, () => {})
  const first = FakeEventSource.instances[0]
  first.readyState = FakeEventSource.OPEN

  for (const cb of env.winListeners.pageshow || []) cb({ persisted: true })
  assert.equal(FakeEventSource.instances.length, 1)

  unbind()
  delete (globalThis as any).window
  delete (globalThis as any).document
  delete (globalThis as any).EventSource
})

test('closes previous EventSource on cleanup', () => {
  const env = makeStreamEnv()
  ;(globalThis as any).window = env.window
  ;(globalThis as any).document = env.document
  ;(globalThis as any).EventSource = FakeEventSource
  FakeEventSource.instances = []

  const unbind = connectTimelineStream('ws-1', () => {}, () => {}, () => {})
  const first = FakeEventSource.instances[0]
  unbind()
  assert.equal(first.closed, true)

  delete (globalThis as any).window
  delete (globalThis as any).document
  delete (globalThis as any).EventSource
})

test('does not reconnect when readyState is OPEN on trigger', () => {
  const env = makeStreamEnv()
  ;(globalThis as any).window = env.window
  ;(globalThis as any).document = env.document
  ;(globalThis as any).EventSource = FakeEventSource
  FakeEventSource.instances = []

  const unbind = connectTimelineStream('ws-1', () => {}, () => {}, () => {})
  const first = FakeEventSource.instances[0]
  first.readyState = FakeEventSource.OPEN

  // visibility + pageshow should not create a second source
  env.document.visibilityState = 'visible'
  for (const cb of env.docListeners.visibilitychange || []) cb()
  for (const cb of env.winListeners.pageshow || []) cb({ persisted: true })
  for (const cb of env.winListeners.online || []) cb()
  assert.equal(FakeEventSource.instances.length, 1)

  unbind()
  delete (globalThis as any).window
  delete (globalThis as any).document
  delete (globalThis as any).EventSource
})
