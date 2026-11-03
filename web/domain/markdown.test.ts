import { describe } from 'node:test'
import { it } from 'node:test'
import assert from 'node:assert/strict'
import { orderedRemarkPlugins } from './markdown.js'
import { fencedLanguage } from './markdown.js'
import { isSafeUrl } from './markdown.js'
import { safeUrl } from './markdown.js'
describe('orderedRemarkPlugins', () => {
  it('places GFM before the CJK emphasis and strikethrough plugins', () => {
    const gfm = {}
    const cjkFriendly = {}
    const gfmStrikethrough = {}

    assert.deepEqual(
      orderedRemarkPlugins({ gfm, cjkFriendly, gfmStrikethrough }),
      [gfm, cjkFriendly, gfmStrikethrough],
    )
  })
})
describe('markdown language helpers', () => {
  it('extracts fenced language', () => {
    assert.equal(fencedLanguage('language-mermaid'), 'mermaid')
    assert.equal(fencedLanguage('language-ts'), 'ts')
  })
})
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
