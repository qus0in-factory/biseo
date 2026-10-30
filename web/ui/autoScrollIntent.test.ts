import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('a locally sent turn is marked as an own send', () => {
  assert.match(src('../domain/optimistic.ts'), /ownSend: true/)
  assert.match(src('../domain/timeline-item.ts'), /ownSend\?: boolean/)
})

test('the scroll hook applies the scroll plan', () => {
  const hook = src('./useAutoScroll.ts')
  assert.match(hook, /planScroll\(prevRef\.current, items, near\)/)
  assert.match(hook, /act === 'bottom'/)
  assert.match(hook, /act === 'jump'/)
})
