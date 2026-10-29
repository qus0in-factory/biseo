import assert from 'node:assert/strict'
import test from 'node:test'
import { applyVisualViewport } from '../domain/visualViewport.js'

test('applyVisualViewport sets css variables', () => {
  const style: Record<string, string> = {}
  const doc = { documentElement: { style: { setProperty(n: string, v: string) { style[n] = v } } } }
  applyVisualViewport({ height: 700, width: 390, offsetTop: 10, offsetLeft: 0, addEventListener() {}, removeEventListener() {} }, doc as any)
  assert.equal(style['--visual-viewport-height'], '700px')
  assert.equal(style['--visual-viewport-width'], '390px')
  assert.equal(style['--visual-viewport-offset-top'], '10px')
})
