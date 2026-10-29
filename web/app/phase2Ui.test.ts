import test from 'node:test'
import assert from 'node:assert/strict'
import { routePaths } from '../routes/routePaths'
import { parseRouteParams } from '../domain/schemas/routeParams'
import { validateMessageInput } from '../domain/schemas/messageInput'
import { useUiStore } from './uiStore'

test('routes exclude history', () => {
  const paths = routePaths
  for (const p of ['/', '/panels', '/chat', '/chat/:paneId']) assert.ok(paths.includes(p))
  assert.ok(!paths.includes('/history'))
})

test('schemas validate', () => {
  assert.equal(validateMessageInput('hello').ok, true)
  assert.equal(validateMessageInput('   ').ok, false)
  assert.deepEqual(parseRouteParams({ tab: 'chat' }), { tab: 'chat' })
  assert.deepEqual(parseRouteParams({ tab: 'history' }), {})
})

test('uiStore tracks tabs', () => {
  const s = useUiStore.getState()
  s.setActiveTab('chat')
  assert.equal(useUiStore.getState().activeTab, 'chat')
  s.setActiveTab('panels')
  assert.equal(useUiStore.getState().activeTab, 'panels')
})
