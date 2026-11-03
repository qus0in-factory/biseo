import { test } from 'node:test'
import r from '../resources.json'
import { createOrderStore } from './orderStore'
import assert from 'node:assert/strict'

test('order store persists through its own storage key', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const writes: [string, string][] = []
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    setItem(key: string, value: string) { writes.push([key, value]) },
  } })
  try {
    const store = createOrderStore(r.paneOrderStorageKey)
    store.getState().save(['p2', 'p1'])
    assert.deepEqual(store.getState().order, ['p2', 'p1'])
    assert.deepEqual(writes, [[r.paneOrderStorageKey, '["p2","p1"]']])
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original)
    else Reflect.deleteProperty(globalThis, 'localStorage')
  }
})
