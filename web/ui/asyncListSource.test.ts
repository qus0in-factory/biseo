import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('loading uses a shared reduced-motion skeleton', () => {
  const state = src('./LoadingState.tsx')
  const rows = src('./LoadingRows.tsx')
  assert.match(state, /LoadingRows/)
  assert.match(rows, /bg-muted/)
  assert.match(rows, /animate-pulse/)
  assert.match(rows, /motion-reduce:animate-none/)
  assert.match(src('./AsyncList.tsx'), /state\.status === 'empty'/)
  assert.match(src('./AsyncFallback.tsx'), /r\.retry/)
})

test('common loading and notice components keep space above them', () => {
  assert.match(src('./LoadingState.tsx'), /'mt-4'/)
  assert.match(src('./LoadingState.tsx'), /className="mt-2 /)
  assert.match(src('./AsyncRefreshing.tsx'), /variant="inline"/)
  assert.match(src('./AsyncFallback.tsx'), /'mt-4 flex flex-col/)
  assert.match(src('./AsyncList.tsx'), /<div className="mt-4">/)
})
