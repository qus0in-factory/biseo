import test from 'node:test'
import assert from 'node:assert/strict'
import { validInterruptAllowlist } from './config-allowlist.js'

test('interrupt allowlist keeps the default to Esc and forbids opencode Ctrl+C', () => {
  assert.equal(validInterruptAllowlist({ default: ['esc'], opencode: ['esc'] }), true)
  assert.equal(validInterruptAllowlist({ default: ['esc'], claude: ['esc', 'ctrl+c'] }), true)
  assert.equal(validInterruptAllowlist({ claude: ['esc'] }), false)
  assert.equal(validInterruptAllowlist({ default: ['esc', 'ctrl+c'] }), false)
  assert.equal(validInterruptAllowlist({ default: ['esc'], opencode: ['ctrl+c'] }), false)
  assert.equal(validInterruptAllowlist({ default: ['enter'] }), false)
})
