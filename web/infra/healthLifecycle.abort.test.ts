import assert from 'node:assert/strict'
import test from 'node:test'
import { bindHealthLifecycle } from '../infra/healthLifecycle.js'

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
