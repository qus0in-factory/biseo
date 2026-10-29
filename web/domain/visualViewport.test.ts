import assert from 'node:assert/strict'
import test from 'node:test'
import { applyVisualViewport, bindVisualViewport } from '../domain/visualViewport.js'

test('applyVisualViewport sets css variables', () => {
  const style: Record<string, string> = {}
  const doc = { documentElement: { style: { setProperty(n: string, v: string) { style[n] = v } } } }
  applyVisualViewport({ height: 700, width: 390, offsetTop: 10, offsetLeft: 0, addEventListener() {}, removeEventListener() {} }, doc as any)
  assert.equal(style['--visual-viewport-height'], '700px')
  assert.equal(style['--visual-viewport-width'], '390px')
  assert.equal(style['--visual-viewport-offset-top'], '10px')
})

test('bindVisualViewport updates and cleans up', () => {
  const listeners: Record<string, Array<() => void>> = {}
  const vv = {
    height: 640, width: 360, offsetTop: 0, offsetLeft: 0,
    addEventListener(type: string, cb: () => void) { (listeners[type] ||= []).push(cb) },
    removeEventListener(type: string, cb: () => void) { listeners[type] = (listeners[type] || []).filter((x) => x !== cb) },
  }
  const style: Record<string, string> = {}
  const doc = { documentElement: { style: { setProperty(n: string, v: string) { style[n] = v } } } }
  const unbind = bindVisualViewport(() => {}, { window: { visualViewport: vv }, document: doc as any })
  assert.equal(style['--visual-viewport-height'], '640px')
  assert.ok((listeners.resize || []).length === 1)
  vv.height = 500
  for (const cb of listeners.resize || []) cb()
  assert.equal(style['--visual-viewport-height'], '500px')
  unbind()
  assert.equal((listeners.resize || []).length, 0)
})

test('bindVisualViewport no-ops without visualViewport', () => {
  const unbind = bindVisualViewport(undefined, { window: {}, document: { documentElement: { style: { setProperty() {} } } } as any })
  assert.equal(typeof unbind, 'function')
  unbind()
})
