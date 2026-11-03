import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { PaneSummary } from '../domain/timeline'
import type { TimelineItem } from '../domain/timeline'
import { PaneDirectoryProvider } from './paneDirectory'
import { AgentHeader } from './AgentHeader'
import { UserBubble } from './UserBubble'

const pane = { paneId: 'w:p1', name: 'opus' } as PaneSummary
const item: TimelineItem = { requestId: 'r', workspaceId: 'w', paneId: 'w:p1', targetName: 'w:p1', promptText: 'hi', status: 'completed', createdAt: '' }
const html = (n: ReactElement) => renderToStaticMarkup(createElement(PaneDirectoryProvider, { panes: [pane], children: n }))

test('timeline sender and target use current pane name', () => {
  for (const node of [createElement(AgentHeader, { item }), createElement(UserBubble, { item })]) {
    const out = html(node)
    assert.ok(out.includes('opus') && !out.includes('w:p1'), out)
  }
})
