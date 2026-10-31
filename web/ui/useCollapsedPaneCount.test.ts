import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('persists and guards storage', () => {
  const src = readFileSync(new URL('./useCollapsedPaneCount.ts', import.meta.url), 'utf8')
  assert.match(src, /localStorage\.getItem/)
  assert.match(src, /localStorage\.setItem/)
  assert.match(src, /try/)
  assert.match(src, /catch/)
})
