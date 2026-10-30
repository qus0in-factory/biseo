import test from 'node:test'
import assert from 'node:assert/strict'
import { routePaths } from '../routes/routePaths'
import { parseRouteParams } from '../domain/schemas/routeParams'
import { validateMessageInput } from '../domain/schemas/messageInput'
import { useUiStore } from './uiStore'

test('single workspace route excludes mode paths', () => {
  const paths = routePaths
  for (const p of ['/', '/chat/:paneId']) assert.ok(paths.includes(p))
  for (const p of ['/panels', '/chat', '/history']) assert.ok(!paths.includes(p))
})

test('schemas validate', () => {
  assert.equal(validateMessageInput('hello').ok, true)
  assert.equal(validateMessageInput('   ').ok, false)
  assert.deepEqual(parseRouteParams({ paneId: 'p1' }), { paneId: 'p1' })
  assert.deepEqual(parseRouteParams({ tab: 'chat' }), {})
})

test('uiStore tracks selected pane', () => {
  const s = useUiStore.getState()
  s.setSelectedPaneId('w1T:p1')
  assert.equal(useUiStore.getState().selectedPaneId, 'w1T:p1')
})
