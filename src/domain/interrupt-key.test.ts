import test from 'node:test'
import assert from 'node:assert/strict'
import { interruptAllowed, normalizeInterruptKey } from './interrupt-key.js'

test('interrupt keys are canonicalized and restricted per agent', () => {
  assert.equal(normalizeInterruptKey(' Escape '), 'esc')
  assert.equal(normalizeInterruptKey('CTRL+C'), 'ctrl+c')
  assert.equal(normalizeInterruptKey('enter'), null)

  const allow = { default: ['esc'], claude: ['esc', 'ctrl+c'] }
  assert.equal(interruptAllowed('claude', 'esc', allow), true)
  assert.equal(interruptAllowed('claude', 'ctrl+c', allow), true)
  assert.equal(interruptAllowed('codex', 'ctrl+c', allow), false)
  assert.equal(interruptAllowed('opencode', 'ctrl+c', { default: ['esc'], opencode: ['ctrl+c'] }), false)
  assert.equal(interruptAllowed(null, 'esc', allow), true)
})
