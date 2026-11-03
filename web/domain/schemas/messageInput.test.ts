import test from 'node:test'
import assert from 'node:assert/strict'
import { validateMessageInput } from './messageInput'
import { routePaths } from '../../routes/routePaths'
import { parseRouteParams } from './routeParams'
import { useUiStore } from '../../app/uiStore'
test('validateMessageInput validates message text', () => {
  const ok = validateMessageInput('hello world')
  assert.equal(ok.ok, true)
  if (ok.ok) assert.equal(ok.data.text, 'hello world')

  const empty = validateMessageInput('   ')
  assert.equal(empty.ok, false)

  const toolong = validateMessageInput('a'.repeat(4001))
  assert.equal(toolong.ok, false)
})
test('schemas validate', () => {
  assert.equal(validateMessageInput('hello').ok, true)
  assert.equal(validateMessageInput('   ').ok, false)
  assert.deepEqual(parseRouteParams({ paneId: 'p1' }), { paneId: 'p1' })
  assert.deepEqual(parseRouteParams({ tab: 'chat' }), {})
})
