import assert from 'node:assert/strict'
import test from 'node:test'
import { bindStreamLifecycle } from '../infra/streamLifecycle.js'
import { makeStreamEnv } from './streamLifecycleEnv.js'

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
