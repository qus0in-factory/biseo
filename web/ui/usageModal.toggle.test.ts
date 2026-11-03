import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageModeRow } from './UsageModeRow'

describe('UsageModal', () => {
  it('has remaining toggle', () => {
    const src = readFileSync(new URL('./UsageModeToggle.tsx', import.meta.url), 'utf8')
    assert.match(src, /role="switch"/)
    assert.match(src, /aria-checked=\{remaining\}/)
    assert.match(src, /w-auto min-w-20/)
    assert.match(src, /whitespace-nowrap/)
  })

  it('does not repeat the selected mode beside the toggle', () => {
    const src = readFileSync(new URL('./UsageModeRow.tsx', import.meta.url), 'utf8')
    assert.doesNotMatch(src, /usageRemaining|usageUsed/)
    assert.match(src, /justify-end/)
    const html = renderToStaticMarkup(createElement(UsageModeRow, { remaining: true, onToggle() {} }))
    assert.doesNotMatch(html, /text-xs text-muted-foreground/)
  })
})
