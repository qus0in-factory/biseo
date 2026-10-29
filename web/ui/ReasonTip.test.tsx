import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { ReasonTip } from './ReasonTip'
import { nextOpen } from './reasonTipToggle'

test('ReasonTip trigger is focusable button with label', () => {
  const html = renderToString(createElement(ReasonTip, { text: '이유 확인' }))
  assert.match(html, /<button[^>]*type="button"/)
  assert.match(html, /aria-label="이유 확인"/)
  assert.match(html, /aria-expanded="false"/)
  assert.match(html, /min-h-6/)
  assert.doesNotMatch(html, /disabled/)
  assert.doesNotMatch(html, /tabindex="-1"/i)
  assert.match(html, /이유 확인/)
})

test('pointer close stays closed, pointer open opens, keyboard toggles', () => {
  assert.equal(nextOpen(true, true), null)
  assert.equal(nextOpen(false, false), true)
  assert.equal(nextOpen(true, null), false)
  assert.equal(nextOpen(false, null), true)
})
