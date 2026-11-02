import test from'node:test'
import assert from'node:assert/strict'
import{readFileSync}from'node:fs'
const src=(f:string)=>readFileSync(new URL(`./${f}.tsx`,import.meta.url),'utf8')
test('header unifies controls with 16px icons and outline',()=>{
 for(const f of['HeaderMenuButton','UsageButton','HealthView','SettingsButton','SessionActions']){
  const s=src(f)
  assert.match(s,/variant="outline"/)
  assert.match(s,/size=\{16\}/)
 }
 assert.match(src('ConnectionStatusBadge'),/min-h-11 rounded-md[\s\S]*size=\{16\}/)
 assert.match(src('AppHeader'),/<SessionActions[\s\S]*connection=[\s\S]*actions=/)
 assert.doesNotMatch(src('DashboardView'),/DashboardHeader/)
})
