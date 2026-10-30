import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('./TimelineView.tsx', import.meta.url), 'utf8')

test('scrolling timeline leaves space after the last message', () => {
  const classes = source.match(/<div ref={ref} className="([^"]+)" onScroll/)?.[1] ?? ''
  assert.match(classes, /overflow-y-auto/)
  assert.match(classes, /(?:^|\s)pb-4(?:\s|$)/)
})
