import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

describe('PaneDrawerContent spacing', () => {
  it('separates usage controls and pane list with the shared drawer gap', () => {
    const src = readFileSync(new URL('./PaneDrawerContent.tsx', import.meta.url), 'utf8')
    assert.match(src, /flex min-h-0 flex-1 flex-col gap-2/)
    assert.match(src, /<PanesView/)
  })
})
