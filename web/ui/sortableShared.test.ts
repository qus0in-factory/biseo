import test from'node:test'
import assert from'node:assert/strict'
import{readFileSync}from'node:fs'
const src=(f:string)=>readFileSync(new URL(f,import.meta.url),'utf8')

test('panel list and usage tabs share the long-press sortable module',()=>{
 const sensors=src('./sortable/sortableSensors.ts')
 assert.match(sensors,/MouseSensor/)
 assert.match(sensors,/TouchSensor/)
 assert.match(sensors,/delay: 350/)
 assert.match(sensors,/tolerance: 8/)
 assert.match(sensors,/KeyboardSensor/)
 assert.match(sensors,/sortableKeyboardCoordinates/)
 for(const f of['./PaneSortableList.tsx','./UsageTabList.tsx']){
  const s=src(f)
  assert.match(s,/SortableList/)
  assert.match(s,/SortableItem/)
 }
 assert.match(src('./sortable/SortableList.tsx'),/accessibility=\{sortableA11y\}/)
 assert.match(src('./sortable/sortableA11y.ts'),/sortableInstructions/)
})
