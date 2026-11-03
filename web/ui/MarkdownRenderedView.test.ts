import { describe } from 'node:test'
import { it } from 'node:test'
import assert from 'node:assert/strict'
import { paragraph } from '../test-util/markdownRenderTestSupport'
import { renderMarkdown } from '../test-util/markdownRenderTestSupport'
import { readFileSync } from 'node:fs'
describe('CJK-friendly Markdown emphasis', () => {
  it('renders bold text before Korean when the closing marker follows punctuation', () => {
    assert.equal(
      renderMarkdown('**수정 필요 (changes)**입니다'),
      paragraph('<strong>수정 필요 (changes)</strong>입니다'),
    )
  })

  it('renders bold text followed by Korean without a space', () => {
    assert.equal(renderMarkdown('**강조**는'), paragraph('<strong>강조</strong>는'))
  })

  it('renders bold text that starts with a parenthesis', () => {
    assert.equal(renderMarkdown('**(괄호)**를'), paragraph('<strong>(괄호)</strong>를'))
  })

  it('keeps existing English emphasis unchanged', () => {
    assert.equal(renderMarkdown('a **bold** word'), paragraph('a <strong>bold</strong> word'))
  })
})
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
describe('Markdown safety source', () => {
  const src = [
    readFileSync(new URL('./MarkdownRenderedView.tsx', import.meta.url), 'utf8'),
    readFileSync(new URL('./markdownComponents.tsx', import.meta.url), 'utf8'),
  ].join('\n')
  it('uses safe links and disables raw html', () => {
    assert.match(src, /noopener noreferrer/)
    assert.match(src, /skipHtml/)
    assert.match(src, /urlTransform/)
  })
})
