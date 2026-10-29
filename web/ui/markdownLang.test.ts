import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { fencedLanguage } from '../domain/markdown.js'

describe('markdown language helpers', () => {
  it('extracts fenced language', () => {
    assert.equal(fencedLanguage('language-mermaid'), 'mermaid')
    assert.equal(fencedLanguage('language-ts'), 'ts')
  })
})
