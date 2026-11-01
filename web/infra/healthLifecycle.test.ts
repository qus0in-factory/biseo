import assert from 'node:assert/strict'
import test from 'node:test'
import { bindHealthLifecycle } from '../infra/healthLifecycle.js'
import { notifyStreamOpen } from '../infra/streamOpenEvent.js'

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
