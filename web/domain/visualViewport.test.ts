import assert from 'node:assert/strict'
import test from 'node:test'
import { bindVisualViewport } from './visualViewport.js'
import { applyVisualViewport } from './visualViewport.js'

test('bindVisualViewport updates and cleans up', () => {
  const L: Record<string, Array<() => void>> = {}
  const vv: any = { height: 640, width: 360, offsetTop: 0, offsetLeft: 0,
    addEventListener(t: string, cb: () => void) { (L[t] ||= []).push(cb) },
    removeEventListener(t: string, cb: () => void) { L[t] = (L[t] || []).filter((x: any) => x !== cb) } }
  const style: Record<string, string> = {}
  const doc: any = { documentElement: { style: { setProperty(n: string, v: string) { style[n] = v } } } }
  const unbind = bindVisualViewport(() => {}, { window: { visualViewport: vv }, document: doc })
  assert.equal(style['--visual-viewport-height'], '640px')
  assert.ok((L.resize || []).length === 1)
  vv.height = 500
  for (const cb of L.resize || []) cb()
  assert.equal(style['--visual-viewport-height'], '500px')
  unbind()
  assert.equal((L.resize || []).length, 0)
})
test('bindVisualViewport no-ops without visualViewport', () => {
  const unbind = bindVisualViewport(undefined, { window: {}, document: { documentElement: { style: { setProperty() {} } } } as any })
  assert.equal(typeof unbind, 'function')
  unbind()
})
test('applyVisualViewport sets css variables', () => {
  const style: Record<string, string> = {}
  const doc = { documentElement: { style: { setProperty(n: string, v: string) { style[n] = v } } } }
  applyVisualViewport({ height: 700, width: 390, offsetTop: 10, offsetLeft: 0, addEventListener() {}, removeEventListener() {} }, doc as any)
  assert.equal(style['--visual-viewport-height'], '700px')
  assert.equal(style['--visual-viewport-width'], '390px')
  assert.equal(style['--visual-viewport-offset-top'], '10px')
})
