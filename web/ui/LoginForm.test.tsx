import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('renders hidden username field and correct autocomplete', () => {
    const html = renderToStaticMarkup(
      React.createElement(LoginForm, { busy: false, onLogin: () => {}, onPinLogin: () => {} })
    )
    assert.match(html, /auto[Cc]omplete="username"/)
    assert.match(html, /class="[^"]*hidden[^"]*"/)
    assert.match(html, /auto[Cc]omplete="current-password"/)
  })

  it('renders login mode tabs with accessibility attrs', () => {
    const html = renderToStaticMarkup(
      React.createElement(LoginForm, { busy: false, onLogin: () => {}, onPinLogin: () => {} })
    )
    assert.match(html, /role="group"/)
    assert.match(html, /aria-pressed="true"/)
  })
})
