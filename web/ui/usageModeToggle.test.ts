import { describe } from 'node:test'
import { it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { UsageModeRow } from './UsageModeRow'
import test from 'node:test'
import r from '../resources.json'
import { UsageModeToggle } from './UsageModeToggle.js'
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
const selected = (remaining: boolean) => {
  const html = renderToStaticMarkup(createElement(UsageModeToggle, { remaining, onToggle: () => {} }))
  const want = remaining ? (r as Record<string, string>).usageRemaining : (r as Record<string, string>).usageUsed
  assert.match(html, new RegExp('bg-primary[\\s\\S]*?' + want + '<'))
}

test('selected mode side carries the highlight', () => {
  selected(true)
  selected(false)
})
