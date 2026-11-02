import{describe,it}from'node:test'
import assert from'node:assert/strict'
import{readFileSync}from'node:fs'
const src=(f:string)=>readFileSync(new URL(f,import.meta.url),'utf8')

describe('HeaderTabs spacing',()=>{
 it('wraps within the header and keeps 44px touch targets',()=>{
  const t=src('./HeaderTabs.tsx')
  assert.match(t,/TabsList className="max-w-full gap-2"/)
  assert.match(t,/TabsTrigger value="usage" className="shrink-0 gap-2"/)
  assert.doesNotMatch(t,/value="notify"|mr-auto/)
  assert.match(src('./UsageButton.tsx'),/UsageModal open=\{open\}/)
  assert.match(src('./SessionActions.tsx'),/<ConnectionStatusBadge[\s\S]*<UsageButton[\s\S]*<SettingsButton/)
  assert.match(src('../components/ui/tabs.tsx'),/min-h-11 flex-wrap/)
 })
})
