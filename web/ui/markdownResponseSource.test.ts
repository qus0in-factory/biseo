import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

describe('MarkdownResponse source', () => {
  const src = [
    readFileSync(new URL('./MarkdownResponse.tsx', import.meta.url), 'utf8'),
    readFileSync(new URL('./MarkdownToggle.tsx', import.meta.url), 'utf8'),
  ].join('\n')

  it('uses a localized accessible switch', () => {
    assert.match(src, /role="switch"/)
    assert.match(src, /aria-checked=\{raw\}/)
    assert.match(src, /aria-label=\{r\.markdownToggleLabel\}/)
  })
  it('places the toggle directly after response content', () => {
    assert.match(src, /\{body\}\s*<div className="flex justify-start">/)
  })
})
