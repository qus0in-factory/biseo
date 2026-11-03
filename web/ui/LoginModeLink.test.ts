import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { LoginModeLink } from './LoginModeLink.js'
import r from '../resources.json'

const html = (toPin: boolean) =>
  renderToStaticMarkup(createElement(LoginModeLink, { toPin, onClick: () => {} }))

test('the PIN screen links to password login and the reverse is explicit', () => {
  const forgot = html(false)
  assert.match(forgot, new RegExp(r.forgotPin))
  assert.match(forgot, /type="button"/)
  assert.doesNotMatch(forgot, new RegExp(r.backToPin))
  const back = html(true)
  assert.match(back, new RegExp(r.backToPin))
  assert.doesNotMatch(back, new RegExp(r.forgotPin))
})
