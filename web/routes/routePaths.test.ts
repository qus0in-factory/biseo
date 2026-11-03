import test from 'node:test'
import assert from 'node:assert/strict'
import { routePaths } from './routePaths'

test('single workspace route excludes mode paths', () => {
  const paths = routePaths
  for (const p of ['/', '/chat/:paneId']) assert.ok(paths.includes(p))
  for (const p of ['/panels', '/chat', '/history']) assert.ok(!paths.includes(p))
})
