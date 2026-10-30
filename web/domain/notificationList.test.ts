import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  addNotification,
  unreadCount,
  readNotification,
  readAllNotifications,
} from './notificationList.js'
import type { NotificationItem } from './notifications.js'

const mk = (id: string, read = false): NotificationItem => ({
  id,
  paneId: 'p1',
  paneName: 'pane',
  status: 'completed',
  text: '',
  createdAt: '2026-01-01T00:00:00Z',
  read,
})

describe('notificationList', () => {
  it('dedups by id keeping newest first', () => {
    const a = mk('a')
    const b = mk('b')
    const a2 = { ...a, text: 'new' }
    const list = addNotification(addNotification([], b), a)
    const next = addNotification(list, a2)
    assert.equal(next.length, 2)
    assert.equal(next[0].id, 'a')
    assert.equal(next[0].text, 'new')
  })
  it('caps at max', () => {
    let list: NotificationItem[] = []
    for (let i = 0; i < 35; i++) list = addNotification(list, mk(String(i)))
    assert.equal(list.length, 30)
  })
  it('unreadCount', () => {
    const list = [mk('a'), mk('b', true)]
    assert.equal(unreadCount(list), 1)
  })
  it('readNotification marks one', () => {
    const list = [mk('a'), mk('b')]
    const next = readNotification(list, 'a')
    assert.equal(next.find((x) => x.id === 'a')?.read, true)
    assert.equal(next.find((x) => x.id === 'b')?.read, false)
  })
  it('readAllNotifications marks all', () => {
    const list = [mk('a'), mk('b')]
    const next = readAllNotifications(list)
    assert.equal(next.every((x) => x.read), true)
  })
})