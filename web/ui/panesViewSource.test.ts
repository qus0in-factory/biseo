import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

describe('PanesView guards', () => {
  it('skips prune on empty panes', () => {
    const src = readFileSync(new URL('./usePinnedPanes.ts', import.meta.url), 'utf8')
    assert.match(src, /if \(panes\.length === 0\) return/)
  })
  it('scrolls only on selection', () => {
    const src = readFileSync(new URL('./usePanesView.ts', import.meta.url), 'utf8')
    assert.match(src, /},\[selectedId\]/)
  })
})
