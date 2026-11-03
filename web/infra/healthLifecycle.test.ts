import assert from 'node:assert/strict'
import test from 'node:test'
import { bindHealthLifecycle } from './healthLifecycle.js'
import { notifyStreamOpen } from './streamOpenEvent.js'
test('backgrounding aborts the check and leaves a hidden page alone', () => {
  const win = new EventTarget()
  const doc = new EventTarget() as EventTarget & { visibilityState: string }
  doc.visibilityState = 'visible'
  ;(globalThis as any).window = win
  ;(globalThis as any).document = doc

  let checks = 0
  let aborts = 0
  const unbind = bindHealthLifecycle({ check: () => checks++, abort: () => aborts++ })

  doc.visibilityState = 'hidden'
  doc.dispatchEvent(new Event('visibilitychange'))
  assert.equal(checks, 0)
  assert.equal(aborts, 1)

  win.dispatchEvent(new Event('pagehide'))
  assert.equal(aborts, 2)
  unbind()

  delete (globalThis as any).window
  delete (globalThis as any).document
})
test('health checks recover on stream, visible, page show and online', () => {
  const win = new EventTarget()
  const doc = new EventTarget() as EventTarget & { visibilityState: string }
  doc.visibilityState = 'visible'
  ;(globalThis as any).window = win
  ;(globalThis as any).document = doc

  let checks = 0
  bindHealthLifecycle({ check: () => checks++, abort: () => {} })

  notifyStreamOpen()
  assert.equal(checks, 1)
  doc.dispatchEvent(new Event('visibilitychange'))
  assert.equal(checks, 2)

  const shown = new Event('pageshow')
  Object.defineProperty(shown, 'persisted', { value: true })
  win.dispatchEvent(shown)
  assert.equal(checks, 3)

  win.dispatchEvent(new Event('online'))
  assert.equal(checks, 4)
  delete (globalThis as any).window
  delete (globalThis as any).document
})
test('unbinding removes every health recovery listener', () => {
  ;(globalThis as any).window = new EventTarget()
  ;(globalThis as any).document = new EventTarget()
  let checks = 0
  const unbind = bindHealthLifecycle({ check: () => checks++, abort: () => {} })
  unbind()
  notifyStreamOpen()
  assert.equal(checks, 0)
  delete (globalThis as any).window
  delete (globalThis as any).document
})
