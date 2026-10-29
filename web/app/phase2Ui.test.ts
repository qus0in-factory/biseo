import test from 'node:test'
import assert from 'node:assert/strict'
import { routePaths } from '../routes/routePaths'
import { parseRouteParams } from '../domain/schemas/routeParams'
import { validateMessageInput } from '../domain/schemas/messageInput'
import { useUiStore } from './uiStore'

test('appRoutes contains expected phase-2 routes', () => {
  const paths = routePaths
  for (const p of ['/', '/panels', '/chat', '/chat/:paneId', '/history']) {
    assert.ok(paths.includes(p))
  }
})

test('phase-2 schemas validate inputs', () => {
  assert.equal(validateMessageInput('hello').ok, true)
  assert.equal(validateMessageInput('   ').ok, false)
  assert.deepEqual(parseRouteParams({ tab: 'chat' }), { tab: 'chat' })
})

test('phase-2 uiStore tracks mobile and view state', () => {
  const s = useUiStore.getState()
  s.setActiveTab('chat')
  assert.equal(useUiStore.getState().activeTab, 'chat')
  s.setActiveTab('panels')
  assert.equal(useUiStore.getState().activeTab, 'panels')
})
