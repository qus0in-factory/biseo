import assert from 'node:assert/strict'
import test from 'node:test'
import { bindHealthLifecycle } from '../infra/healthLifecycle.js'
import { notifyStreamOpen } from '../infra/streamOpenEvent.js'

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
