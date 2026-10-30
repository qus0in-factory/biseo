import test from 'node:test'
import assert from 'node:assert/strict'
import { useUiStore } from './uiStore'

test('uiStore manages local UI states', () => {
  const store = useUiStore.getState()
  assert.equal(store.drawerOpen, false)
  store.toggleDrawer()
  assert.equal(useUiStore.getState().drawerOpen, true)
  store.setDrawerOpen(false)
  assert.equal(useUiStore.getState().drawerOpen, false)
  store.setSelectedPaneId('w1T:p1')
  assert.equal(useUiStore.getState().selectedPaneId, 'w1T:p1')
})
