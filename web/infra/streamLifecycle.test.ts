import assert from 'node:assert/strict'
import test from 'node:test'
import { bindStreamLifecycle } from './streamLifecycle.js'
import { makeStreamEnv } from '../test-util/streamLifecycleEnv'
test('bindStreamLifecycle cleanup removes listeners', () => {
  const env = makeStreamEnv()
  ;(globalThis as any).window = env.window
  ;(globalThis as any).document = env.document

  const unbind = bindStreamLifecycle(() => {})
  unbind()
  assert.equal((env.docListeners.visibilitychange || []).length, 0)
  assert.equal((env.winListeners.pageshow || []).length, 0)

  delete (globalThis as any).window
  delete (globalThis as any).document
})
test('bindStreamLifecycle triggers on visible and pageshow persisted', () => {
  const env = makeStreamEnv()
  ;(globalThis as any).window = env.window
  ;(globalThis as any).document = env.document

  let calls = 0
  const unbind = bindStreamLifecycle(() => { calls++ })

  env.document.visibilityState = 'visible'
  for (const cb of env.docListeners.visibilitychange || []) cb()
  assert.equal(calls, 1)

  for (const cb of env.winListeners.pageshow || []) cb({ persisted: true })
  assert.equal(calls, 2)

  for (const cb of env.winListeners.pageshow || []) cb({ persisted: false })
  assert.equal(calls, 2)

  unbind()
  delete (globalThis as any).window
  delete (globalThis as any).document
})
