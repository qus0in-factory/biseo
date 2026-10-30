import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

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
