import test from 'node:test'
import assert from 'node:assert/strict'
import { usePaneListStore } from './paneListStore'
import r from '../resources.json'

test('toggle persists expanded and folded browser state', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const saved = new Map<string, string>()
  Object.defineProperty(globalThis, 'localStorage', { configurable: true,
    value: { setItem: (key: string, value: string) => saved.set(key, value) } })
  try {
    usePaneListStore.setState({ expanded: false })
    usePaneListStore.getState().toggle()
    assert.equal(saved.get(r.paneListExpandedStorageKey), 'true')
    usePaneListStore.getState().toggle()
    assert.equal(saved.get(r.paneListExpandedStorageKey), 'false')
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original)
    else Reflect.deleteProperty(globalThis, 'localStorage')
  }
})
