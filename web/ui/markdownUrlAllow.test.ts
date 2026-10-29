import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { isSafeUrl, safeUrl } from '../domain/markdown.js'

describe('markdown url allow helpers', () => {
  it('allows https and mailto urls', () => {
    assert.equal(isSafeUrl('https://example.com/a'), true)
    assert.equal(isSafeUrl('mailto:a@b.com'), true)
  })
  it('blocks javascript urls', () => {
    assert.equal(isSafeUrl('javascript:alert(1)'), false)
    assert.equal(safeUrl('javascript:alert(1)'), undefined)
  })
})
