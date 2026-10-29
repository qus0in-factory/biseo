import test from 'node:test'
import assert from 'node:assert/strict'
import { validateMessageInput } from './messageInput'

test('validateMessageInput validates message text', () => {
  const ok = validateMessageInput('hello world')
  assert.equal(ok.ok, true)
  if (ok.ok) assert.equal(ok.data.text, 'hello world')

  const empty = validateMessageInput('   ')
  assert.equal(empty.ok, false)

  const toolong = validateMessageInput('a'.repeat(4001))
  assert.equal(toolong.ok, false)
})
