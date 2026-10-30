import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { unreadCount, readNotification, readAllNotifications } from './notificationList.js'
import type { NotificationItem } from './notifications.js'

const mk = (id: string, read = false): NotificationItem => ({
  id, paneId: 'p1', paneName: 'pane', status: 'completed',
  text: '', createdAt: '2026-01-01T00:00:00Z', read,
})

describe('notification read', () => {
  it('unreadCount', () => {
    assert.equal(unreadCount([mk('a'), mk('b', true)]), 1)
  })
  it('readNotification marks one', () => {
    const next = readNotification([mk('a'), mk('b')], 'a')
    assert.equal(next.find((x) => x.id === 'a')?.read, true)
    assert.equal(next.find((x) => x.id === 'b')?.read, false)
  })
  it('readAll marks all', () => {
    const next = readAllNotifications([mk('a'), mk('b')])
    assert.equal(next.every((x) => x.read), true)
  })
})