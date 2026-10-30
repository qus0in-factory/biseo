import assert from 'node:assert/strict'
import test from 'node:test'
import type { TimelineItem } from '../domain/timeline'
import { AgentHeader } from './AgentHeader'
import { CancelTurnButton } from './CancelTurnButton'

const item: TimelineItem = { requestId: 'r1', workspaceId: 'w1', paneId: 'p1', targetName: 'T', promptText: 'x', status: 'queued', createdAt: '' }
const hasCancel = (node: any): boolean => {
  if (!node) return false
  if (Array.isArray(node)) return node.some(hasCancel)
  return node.type === CancelTurnButton || hasCancel(node.props?.children)
}

const onCancel = () => {}
test('agent cancel appears only for queued turns', () => {
  const tree = (status: 'queued' | 'working') => AgentHeader({ item: { ...item, status }, onCancel })
  assert.equal(hasCancel(tree('queued').props.children), true)
  assert.equal(hasCancel(tree('working').props.children), false)
})
