import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TimelineContents } from './TimelineContents'
import r from '../resources.json'

test('no target is a selection prompt, not a successful empty timeline', () => {
 const html = renderToStaticMarkup(createElement(TimelineContents, {
  timeline: [], state: { status: 'loading' },
 }))
 assert.ok(html.includes(r.selectTarget))
 assert.ok(!html.includes(r.emptyTimeline))
})
