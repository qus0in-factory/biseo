import test from 'node:test'
import assert from 'node:assert/strict'
import { unknownUsage } from './usage-unknown.js'

test('unknownUsage returns empty windows and unknown state', () => {
  const res = unknownUsage('test-provider')
  assert.equal(res.provider, 'test-provider')
  assert.equal(res.state, 'unknown')
  assert.deepEqual(res.windows, [])
})
