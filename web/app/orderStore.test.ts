import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src=(f:string)=>readFileSync(new URL(f,new URL("../ui/orderWiring.test.ts", import.meta.url).href),'utf8')
test('panels and usage tabs read and persist the shared order stores',()=>{
 assert.match(src('./usePanesView.ts'),/usePaneOrder/)
 assert.match(src('../app/usePaneOrder.ts'),/useOrderedIds/)
 assert.match(src('../app/useUsageOrder.ts'),/useOrderedIds/)
 assert.match(src('./UsageDashboard.tsx'),/useUsageOrder/)
 assert.match(src('../app/orderStore.ts'),/localStorage\.setItem/)
 assert.match(src('../app/useOrderedIds.ts'),/mergeOrder/)
 assert.match(src('../app/useOrderedIds.ts'),/current\.length/)
 for(const f of['../app/paneOrderStore.ts','../app/usageOrderStore.ts'])assert.match(src(f),/createOrderStore/)
 assert.doesNotMatch(src('../app/uiStore.ts'),/pinned|parsePinnedPanes/)
})
