import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { isSafeUrl, safeUrl, fencedLanguage } from '../domain/markdown.js'

describe('markdown helpers', () => {
  it('allows https and mailto urls', () => {
    assert.equal(isSafeUrl('https://example.com/a'), true)
    assert.equal(isSafeUrl('mailto:a@b.com'), true)
  })
  it('blocks javascript urls', () => {
    assert.equal(isSafeUrl('javascript:alert(1)'), false)
    assert.equal(safeUrl('javascript:alert(1)'), undefined)
  })
  it('extracts fenced language', () => {
    assert.equal(fencedLanguage('language-mermaid'), 'mermaid')
    assert.equal(fencedLanguage('language-ts'), 'ts')
  })
})

describe('MarkdownResponse source', () => {
  const src = readFileSync(new URL('./MarkdownResponse.tsx', import.meta.url), 'utf8')
  it('uses aria-pressed toggle', () => {
    assert.match(src, /aria-pressed/)
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
  it('renders mermaid via pele', () => {
    const mermaidSrc = readFileSync(new URL('./MermaidBlock.tsx', import.meta.url), 'utf8')
    assert.match(mermaidSrc, /pele\/lazy/)
    assert.match(mermaidSrc, /sanitizeSvg/)
  })
})
