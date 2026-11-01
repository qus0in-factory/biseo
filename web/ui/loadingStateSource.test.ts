import assert from 'node:assert/strict'
import test from 'node:test'
import { readdirSync, readFileSync } from 'node:fs'
const root = new URL('..', import.meta.url)
const tsx = readdirSync(root, { recursive: true }).map(String).filter((f) => f.endsWith('.tsx'))
test('shared loading owns skeleton and text', () => {
  for (const f of tsx) {
    if (f === 'ui/LoadingRows.tsx' || f === 'ui/LoadingState.tsx') continue
    const s = readFileSync(new URL(f, root), 'utf8')
    assert.doesNotMatch(s, /animate-pulse|ListSkeleton|LoginSkeleton|skeleton=|>\s*\{r\.loading\}/, f)
  }
})
