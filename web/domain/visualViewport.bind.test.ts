import assert from 'node:assert/strict'
import test from 'node:test'
import { bindVisualViewport } from '../domain/visualViewport.js'

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
