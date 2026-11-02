import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('RecentPull separates every status from its button by the shared 16px gap', () => {
  const src = readFileSync(new URL('./RecentPullButton.tsx', import.meta.url), 'utf8')
  assert.match(src, /flex flex-col items-start gap-4/)
  assert.ok(src.includes('[&>p]:mt-0'))
  assert.match(src, /pull.isPending.*LoadingState/)
  assert.match(src, /pull.isError.*role="alert"/)
  assert.match(src, /pull.isSuccess.*role="status"/)
})
