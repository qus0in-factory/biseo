import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageModeToggle } from './UsageModeToggle.js'

const selected = (remaining: boolean) => {
  const html = renderToStaticMarkup(createElement(UsageModeToggle, { remaining, onToggle: () => {} }))
  const want = remaining ? (r as Record<string, string>).usageRemaining : (r as Record<string, string>).usageUsed
  assert.match(html, new RegExp('bg-primary[\\s\\S]*?' + want + '<'))
}

test('selected mode side carries the highlight', () => {
  selected(true)
  selected(false)
})
