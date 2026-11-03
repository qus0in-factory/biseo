import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { paragraph, renderMarkdown } from './markdownRenderTestSupport.js'

describe('CJK-friendly Markdown strikethrough and code', () => {
  it('does not convert emphasis markers inside inline code', () => {
    const html = renderMarkdown('`**코드**` 그대로')
    assert.match(html, /<code[^>]*>\*\*코드\*\*<\/code> 그대로/)
    assert.doesNotMatch(html, /<strong>/)
  })

  it('renders GFM strikethrough next to Korean', () => {
    assert.equal(renderMarkdown('~~한글~~이 취소'), paragraph('<del>한글</del>이 취소'))
  })

  it('renders GFM strikethrough when the closing marker follows punctuation', () => {
    assert.equal(
      renderMarkdown('~~취소(괄호)~~입니다'),
      paragraph('<del>취소(괄호)</del>입니다'),
    )
  })
})
