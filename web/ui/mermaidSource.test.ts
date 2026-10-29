import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

describe('MermaidBlock source', () => {
  it('renders mermaid via pele', () => {
    const mermaidSrc = [
      readFileSync(new URL('./MermaidBlock.tsx', import.meta.url), 'utf8'),
      readFileSync(new URL('./renderMermaid.ts', import.meta.url), 'utf8'),
    ].join('\n')
    assert.match(mermaidSrc, /pele\/lazy/)
    assert.match(mermaidSrc, /sanitizeSvg/)
  })
})
