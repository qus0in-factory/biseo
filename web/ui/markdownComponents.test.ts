import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { markdownComponents } from './markdownComponents.js'

const Anchor = markdownComponents.a as (props: Record<string, unknown>) => ReactNode
const render = (href: string) =>
  renderToStaticMarkup(createElement(Anchor, { href }, 'link'))

test('markdown links drop unsafe schemes but keep noopener', () => {
  const unsafe = render('javascript:alert(1)')
  assert.doesNotMatch(unsafe, /href=/)
  assert.match(unsafe, /rel="noopener noreferrer"/)
  assert.match(render('https://example.com/a'), /href="https:\/\/example.com\/a"/)
})
