import test from 'node:test'
import assert from 'node:assert/strict'
import { appRoutes } from '../routes/appRoutes'
import { parseRouteParams } from '../domain/schemas/routeParams'
import { validateMessageInput } from '../domain/schemas/messageInput'
import { useUiStore } from './uiStore'

test('appRoutes contains expected phase-2 routes', () => {
  const paths = appRoutes.map((r) => r.path)
  assert.ok(paths.includes('/'))
  assert.ok(paths.includes('/panels'))
  assert.ok(paths.includes('/chat'))
  assert.ok(paths.includes('/chat/:paneId'))
  assert.ok(paths.includes('/history'))
})

test('phase-2 schemas validate inputs', () => {
  assert.equal(validateMessageInput('hello').ok, true)
  assert.equal(validateMessageInput('   ').ok, false)
  assert.deepEqual(parseRouteParams({ tab: 'chat' }), { tab: 'chat' })
})

test('phase-2 uiStore tracks mobile and view state', () => {
  const s = useUiStore.getState()
  s.setActiveTab('panels')
  assert.equal(useUiStore.getState().activeTab, 'panels')
})
