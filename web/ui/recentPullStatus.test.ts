import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('pull status stays announced above the composer', () => {
  const status = readFileSync(new URL('./RecentPullStatus.tsx', import.meta.url), 'utf8')
  assert.match(status, /pull\.isPending[\s\S]*recentLoading/)
  assert.match(status, /pull\.isError[\s\S]*role="alert"[\s\S]*recentError/)
  assert.match(status, /pull\.isSuccess[\s\S]*role="status"[\s\S]*recent_/)
})
