import test from'node:test'
import assert from'node:assert/strict'
import{readFileSync}from'node:fs'
const src=(f:string)=>readFileSync(new URL(`./${f}.tsx`,import.meta.url),'utf8')
test('header controls use ghost styling with 16px icons',()=>{
 for(const f of['HeaderMenuButton','UsageButton','HealthView','SettingsButton','SessionActions']){
  const s=src(f)
  assert.match(s,/variant="ghost"/)
  assert.match(s,/size=\{16\}/)
  assert.doesNotMatch(s,/variant="outline"/)
 }
 assert.match(src('ConnectionStatusBadge'),/min-h-11[\s\S]*rounded-md[\s\S]*size=\{16\}/)
 assert.doesNotMatch(src('ConnectionStatusBadge'),/variant="outline"/)
 assert.match(src('AppHeader'),/<SessionActions[\s\S]*connection=[\s\S]*actions=/)
 assert.doesNotMatch(src('DashboardView'),/DashboardHeader/)
})
