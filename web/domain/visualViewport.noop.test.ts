import assert from 'node:assert/strict'
import test from 'node:test'
import { bindVisualViewport } from '../domain/visualViewport.js'

test('bindVisualViewport no-ops without visualViewport', () => {
  const unbind = bindVisualViewport(undefined, { window: {}, document: { documentElement: { style: { setProperty() {} } } } as any })
  assert.equal(typeof unbind, 'function')
  unbind()
})
