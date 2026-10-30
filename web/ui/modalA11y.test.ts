import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

describe('Modal a11y', () => {
  it('uses sheet a11y with Escape handling', () => {
    const modal = readFileSync(new URL('./Modal.tsx', import.meta.url), 'utf8')
    const sheet = readFileSync(new URL('../components/ui/useSheetA11y.ts', import.meta.url), 'utf8')
    assert.match(modal, /useSheetA11y\(open,\s*onClose\)/)
    assert.match(sheet, /e\.key === 'Escape'/)
    assert.match(sheet, /trapTabKey/)
  })
  it('close button calls onClose', () => {
    const modal = readFileSync(new URL('./Modal.tsx', import.meta.url), 'utf8')
    assert.match(modal, /onClick=\{onClose\}/)
  })
})