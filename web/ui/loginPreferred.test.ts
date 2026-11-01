import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { LoginForm } from './LoginForm.js'

const html = (pinPreferred?: boolean | null) =>
  renderToStaticMarkup(createElement(LoginForm, { busy: false, onLogin: () => {}, onPinLogin: () => {}, pinPreferred }))

test('PIN first only when the server preference is true', () => {
  const out = html(true)
  assert.match(out, /role="group"/)
  assert.match(out, /6자리 PIN/)
  assert.doesNotMatch(out, /current-password/)
})

test('loading, false, and failed checks show password only', () => {
  for (const value of [undefined, null, false]) {
    const out = html(value)
    assert.doesNotMatch(out, /role="group"/)
    assert.doesNotMatch(out, /6자리 PIN/)
    assert.match(out, /current-password/)
  }
})
