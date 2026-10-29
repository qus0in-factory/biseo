import test from 'node:test'
import assert from 'node:assert/strict'
import { useUiStore } from './uiStore'

test('uiStore manages local UI states', () => {
  const store = useUiStore.getState()
  assert.equal(store.drawerOpen, false)
  assert.equal(store.activeTab, 'panels')

  store.toggleDrawer()
  assert.equal(useUiStore.getState().drawerOpen, true)

  store.setDrawerOpen(false)
  assert.equal(useUiStore.getState().drawerOpen, false)

  store.setActiveTab('chat')
  assert.equal(useUiStore.getState().activeTab, 'chat')

  store.setSelectedPaneId('w1T:p1')
  assert.equal(useUiStore.getState().selectedPaneId, 'w1T:p1')
})
