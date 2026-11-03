import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { TimelineItem } from '../domain/timeline'
import { AgentHeader } from './AgentHeader'
import r from '../resources.json'

const item: TimelineItem = { requestId: 'r1', workspaceId: 'w1', paneId: 'p1', targetName: 'T', promptText: 'x', status: 'queued', createdAt: '' }
const onCancel = () => {}

test('agent cancel appears only for queued turns', () => {
  const html = (status: 'queued' | 'working') =>
    renderToStaticMarkup(createElement(AgentHeader, { item: { ...item, status }, onCancel }))
  assert.ok(html('queued').includes(`${r.cancel} r1`))
  assert.ok(!html('working').includes(`${r.cancel} r1`))
})
