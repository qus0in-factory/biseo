import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { TimelineHeader } from './TimelineHeader'
import assert from 'node:assert/strict'

test('timeline heading renders its localized title with a decorative icon', () => {
  const out = renderToStaticMarkup(createElement(TimelineHeader, {}))
  assert.match(out, /<h2/)
  assert.ok(out.includes(r.timelineTitle))
  assert.match(out, /aria-hidden="true"/)
  assert.equal((out.match(/<svg/g) ?? []).length, 1)
})
