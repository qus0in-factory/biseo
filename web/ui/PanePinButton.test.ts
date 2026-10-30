import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

describe('PanePinButton accessibility', () => {
  it('keeps an icon-only button with aria/title and no visible label span', () => {
    const src = readFileSync(new URL('./PanePinButton.tsx', import.meta.url), 'utf8')
    assert.match(src, /aria-label=\{label\}/)
    assert.match(src, /title=\{label\}/)
    assert.match(src, /<Star/)
    assert.doesNotMatch(src, /<span>/)
  })
})
