import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { Modal } from './Modal'
import { describe } from 'node:test'
import { it } from 'node:test'
import assert from 'node:assert/strict'
import { ModalCloseButton } from './ModalCloseButton'

describe('Modal a11y', () => {
  it('close button calls onClose', () => {
    let closed = false
    const button = ModalCloseButton({onClose: () => {closed = true}})
    button.props.onClick()
    assert.equal(closed, true)
    assert.equal(button.props.variant, 'ghost')
  })
})
describe('UsageModal', () => {
test('modal exposes its dialog title and hides all content when closed', () => {
  const props = { title: r.usageTitle, onClose() {}, children: 'BODY', layout: 'adaptive' as const }
  const out = renderToStaticMarkup(createElement(Modal, { ...props, open: true }))
  assert.match(out, /role="dialog"/)
  assert.match(out, /aria-modal="true"/)
  assert.ok(out.includes(`aria-label="${r.usageTitle}"`))
  assert.ok(out.includes('BODY'))
  assert.equal(renderToStaticMarkup(createElement(Modal, { ...props, open: false })), '')
})

})
