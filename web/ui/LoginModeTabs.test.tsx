import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { LoginModeTabs } from './LoginModeTabs'

describe('LoginModeTabs', () => {
  it('renders password mode active with background color and aria-pressed', () => {
    const html = renderToStaticMarkup(
      React.createElement(LoginModeTabs, { pinMode: false, onChange: () => {} })
    )
    assert.match(html, /aria-pressed="true"/)
    assert.match(html, /aria-pressed="false"/)
    assert.ok(html.includes('bg-primary'), 'active tab has background color')
  })

  it('renders pin mode active with background color and aria-pressed', () => {
    const html = renderToStaticMarkup(
      React.createElement(LoginModeTabs, { pinMode: true, onChange: () => {} })
    )
    assert.match(html, /aria-pressed="true"/)
    assert.ok(html.includes('bg-primary'), 'active tab has background color')
  })
})
