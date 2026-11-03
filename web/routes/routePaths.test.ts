import test from 'node:test'
import assert from 'node:assert/strict'
import { routePaths } from './routePaths'
import { parseRouteParams } from '../domain/schemas/routeParams'
import { validateMessageInput } from '../domain/schemas/messageInput'
import { useUiStore } from '../app/uiStore'

test('single workspace route excludes mode paths', () => {
  const paths = routePaths
  for (const p of ['/', '/chat/:paneId']) assert.ok(paths.includes(p))
  for (const p of ['/panels', '/chat', '/history']) assert.ok(!paths.includes(p))
})
