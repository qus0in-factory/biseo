import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PaneStatusBadge } from '../ui/PaneStatusBadge.js'
import type { PaneStatus } from '../domain/timeline.js'

const states: PaneStatus[] = ['idle', 'working', 'done', 'blocked', 'unknown']

test('status badge classes are distinct per state', () => {
  const classes = states.map((s) => {
    const h = renderToStaticMarkup(React.createElement(PaneStatusBadge, { status: s }))
    const m = h.match(/class="([^"]*)"/)
    assert.ok(m, `${s} should render a class attribute`)
    return m![1]
  })
  assert.equal(new Set(classes).size, states.length)
})
