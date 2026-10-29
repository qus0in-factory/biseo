import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { isSafeUrl, safeUrl } from '../domain/markdown.js'

describe('markdown url block helpers', () => {
  it('blocks data urls', () => {
    assert.equal(isSafeUrl('data:text/html,<script>alert(1)</script>'), false)
    assert.equal(safeUrl('data:text/html,<script>alert(1)</script>'), undefined)
  })
  it('blocks case and whitespace obfuscated schemes', () => {
    assert.equal(isSafeUrl('JavaScript:alert(1)'), false)
    assert.equal(isSafeUrl('java\tscript:alert(1)'), false)
    assert.equal(isSafeUrl('  javascript:alert(1)'), false)
    assert.equal(isSafeUrl('vbscript:msgbox(1)'), false)
    assert.equal(isSafeUrl('DATA:TEXT/HTML,x'), false)
  })
})
