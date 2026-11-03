import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { paragraph, renderMarkdown } from './markdownRenderTestSupport.js'

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
