import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { addNotification } from './notificationList.js'
import type { NotificationItem } from './notifications.js'

const mk = (id: string): NotificationItem => ({
  id, paneId: 'p1', paneName: 'pane', status: 'completed',
  text: '', createdAt: '2026-01-01T00:00:00Z', read: false,
})

describe('addNotification', () => {
  it('dedups by id keeping newest', () => {
    const a = mk('a')
    const a2 = { ...a, text: 'new' }
    const b = mk('b')
    const list = addNotification(addNotification([], b), a)
    const next = addNotification(list, a2)
    assert.equal(next.length, 2)
    assert.equal(next[0].id, 'a')
    assert.equal(next[0].text, 'new')
  })
  it('caps at 30', () => {
    let list: NotificationItem[] = []
    for (let i = 0; i < 35; i++) list = addNotification(list, mk(String(i)))
    assert.equal(list.length, 30)
  })
})