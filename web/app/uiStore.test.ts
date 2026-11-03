import test from 'node:test'
import assert from 'node:assert/strict'
import { useUiStore } from './uiStore'
import { readFileSync } from 'node:fs'
import r from '../resources.json'
import { routePaths } from '../routes/routePaths'
import { parseRouteParams } from '../domain/schemas/routeParams'
import { validateMessageInput } from '../domain/schemas/messageInput'
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
const src=(f:string)=>readFileSync(new URL(f,new URL("../ui/integrationResources.test.ts", import.meta.url).href),'utf8')
test('0.4.6 merge keeps feature resources and removes panel bookmark controls',()=>{
 for(const k of['recentPull','openMenu','paneOrderStorageKey','usageOrderStorageKey','modelUnknown','usageReauth_grok','usageAuthStaleAria'])assert.equal(typeof(r as Record<string,unknown>)[k],'string')
 for(const k of['pinnedStorageKey','pinPane','unpinPane'])assert.equal(k in r,false)
 assert.doesNotMatch(src('../app/uiStore.ts'),/pinned|parsePinnedPanes/)
 assert.doesNotMatch(src('./PaneItem.tsx'),/PanePinButton|pinned/)
})
test('uiStore tracks selected pane', () => {
  const s = useUiStore.getState()
  s.setSelectedPaneId('w1T:p1')
  assert.equal(useUiStore.getState().selectedPaneId, 'w1T:p1')
})
