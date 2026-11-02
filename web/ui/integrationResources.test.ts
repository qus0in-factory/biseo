import test from'node:test'
import assert from'node:assert/strict'
import{readFileSync}from'node:fs'
import r from'../resources.json'
const src=(f:string)=>readFileSync(new URL(f,import.meta.url),'utf8')
test('0.4.6 merge keeps feature resources and removes panel bookmark controls',()=>{
 for(const k of['recentPull','openMenu','paneOrderStorageKey','usageOrderStorageKey','modelUnknown','usageReauth_grok','usageAuthStaleAria'])assert.equal(typeof(r as Record<string,unknown>)[k],'string')
 for(const k of['pinnedStorageKey','pinPane','unpinPane'])assert.equal(k in r,false)
 assert.doesNotMatch(src('../app/uiStore.ts'),/pinned|parsePinnedPanes/)
 assert.doesNotMatch(src('./PaneItem.tsx'),/PanePinButton|pinned/)
})
