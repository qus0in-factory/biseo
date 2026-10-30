import assert from 'node:assert/strict'
import test from 'node:test'
import { removeNotification, removeSeenNotifications } from './notificationList.js'
import type { NotificationItem } from './notifications.js'

const mk = (id: string, paneId: string): NotificationItem => ({
  id, paneId, paneName: 'pane', status: 'completed', text: '',
  createdAt: '2026-01-01T00:00:00Z', read: false,
})

test('dismiss removes only the selected notification id', () => {
  const list = [mk('a', 'p1'), mk('b', 'p1')]
  assert.deepEqual(removeNotification(list, 'a').map((n) => n.id), ['b'])
})

test('seen removal keeps other turns and panes', () => {
  const list = [mk('a', 'p1'), mk('b', 'p1'), mk('c', 'p2')]
  assert.deepEqual(removeSeenNotifications(list, 'p1', ['a']).map((n) => n.id), ['b', 'c'])
})
