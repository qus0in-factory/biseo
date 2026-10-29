import assert from 'node:assert/strict'
import test from 'node:test'
import { bindStreamLifecycle } from '../infra/streamLifecycle.js'

function makeEnv() {
  const winListeners: Record<string, Array<(e?: any) => void>> = {}
  const docListeners: Record<string, Array<(e?: any) => void>> = {}
  const window = {
    addEventListener(type: string, cb: (e?: any) => void) {
      (winListeners[type] ||= []).push(cb)
    },
    removeEventListener(type: string, cb: (e?: any) => void) {
      winListeners[type] = (winListeners[type] || []).filter((x) => x !== cb)
    },
  }
  const document = {
    visibilityState: 'hidden' as string,
    addEventListener(type: string, cb: (e?: any) => void) {
      (docListeners[type] ||= []).push(cb)
    },
    removeEventListener(type: string, cb: (e?: any) => void) {
      docListeners[type] = (docListeners[type] || []).filter((x) => x !== cb)
    },
  }
  return { window, document, winListeners, docListeners }
}

test('bindStreamLifecycle triggers on visible and pageshow persisted', () => {
  const env = makeEnv()
  ;(globalThis as any).window = env.window
  ;(globalThis as any).document = env.document

  let calls = 0
  const unbind = bindStreamLifecycle(() => { calls++ })

  env.document.visibilityState = 'visible'
  for (const cb of env.docListeners.visibilitychange || []) cb()
  assert.equal(calls, 1)

  for (const cb of env.winListeners.pageshow || []) cb({ persisted: true })
  assert.equal(calls, 2)

  // non-persisted pageshow does not trigger
  for (const cb of env.winListeners.pageshow || []) cb({ persisted: false })
  assert.equal(calls, 2)

  unbind()
  delete (globalThis as any).window
  delete (globalThis as any).document
})

test('bindStreamLifecycle cleanup removes listeners', () => {
  const env = makeEnv()
  ;(globalThis as any).window = env.window
  ;(globalThis as any).document = env.document

  const unbind = bindStreamLifecycle(() => {})
  unbind()
  assert.equal((env.docListeners.visibilitychange || []).length, 0)
  assert.equal((env.winListeners.pageshow || []).length, 0)

  delete (globalThis as any).window
  delete (globalThis as any).document
})
