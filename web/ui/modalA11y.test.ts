import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { ModalCloseButton } from './ModalCloseButton'

describe('Modal a11y', () => {
  it('uses sheet a11y with Escape handling', () => {
    const modal = readFileSync(new URL('./Modal.tsx', import.meta.url), 'utf8')
    const sheet = readFileSync(new URL('../components/ui/useSheetA11y.ts', import.meta.url), 'utf8')
    assert.match(modal, /useSheetA11y\(open,\s*onClose\)/)
    assert.match(sheet, /e\.key === 'Escape'/)
    assert.match(sheet, /trapTabKey/)
  })
  it('close button calls onClose', () => {
    let closed = false
    const button = ModalCloseButton({onClose: () => {closed = true}})
    button.props.onClick()
    assert.equal(closed, true)
    assert.equal(button.props.variant, 'outline')
  })
})
