import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('loading uses a reduced-motion skeleton and empty only follows success', () => {
  const skeleton = src('./ListSkeleton.tsx')
  assert.match(skeleton, /bg-muted/)
  assert.match(skeleton, /animate-pulse/)
  assert.match(skeleton, /motion-reduce:animate-none/)
  assert.match(src('./AsyncList.tsx'), /state\.status === 'empty'/)
  assert.match(src('./AsyncFallback.tsx'), /r\.retry/)
})

test('common loading and notice components keep space above them', () => {
  assert.match(src('./ListSkeleton.tsx'), /className="mt-4 /)
  assert.match(src('./AsyncRefreshing.tsx'), /className="mt-2 /)
  assert.match(src('./AsyncFallback.tsx'), /'mt-4 flex flex-col/)
  assert.match(src('./AsyncList.tsx'), /<div className="mt-4">/)
})
