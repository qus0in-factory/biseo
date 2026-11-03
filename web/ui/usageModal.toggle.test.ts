import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

describe('UsageModal', () => {
  it('has remaining toggle', () => {
    const src = readFileSync(new URL('./UsageModeToggle.tsx', import.meta.url), 'utf8')
    assert.match(src, /role="switch"/)
    assert.match(src, /aria-checked=\{remaining\}/)
    assert.match(src, /w-auto min-w-20/)
    assert.match(src, /whitespace-nowrap/)
  })
})