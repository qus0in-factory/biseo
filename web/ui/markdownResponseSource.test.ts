import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

describe('MarkdownResponse source', () => {
  const src = [
    readFileSync(new URL('./MarkdownResponse.tsx', import.meta.url), 'utf8'),
    readFileSync(new URL('./MarkdownToggle.tsx', import.meta.url), 'utf8'),
    readFileSync(new URL('./MarkdownRenderedView.tsx', import.meta.url), 'utf8'),
    readFileSync(new URL('./markdownComponents.tsx', import.meta.url), 'utf8'),
  ].join('\n')

  it('uses aria-pressed toggle', () => {
    assert.match(src, /aria-pressed/)
  })
  it('places the toggle at the start of the response footer', () => {
    assert.match(src, /justify-start/)
    assert.doesNotMatch(src, /justify-end/)
  })
  it('uses noopener noreferrer links', () => {
    assert.match(src, /noopener noreferrer/)
  })
  it('disables raw html', () => {
    assert.match(src, /skipHtml/)
  })
  it('restricts urls', () => {
    assert.match(src, /urlTransform/)
  })
})
