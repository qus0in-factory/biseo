import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import r from '../resources.json'
import { readFileSync } from 'node:fs'
test('header contract and assets exist', () => {
  assert.equal(typeof r.title,"string")
  assert.equal(r.title, 'Biseo')
  assert.equal(typeof r.logout, 'string')
  assert.equal(r.logout, '로그아웃')

  const favPath = path.resolve(import.meta.dirname, '../public/favicon.svg')
  assert.ok(fs.existsSync(favPath), 'favicon.svg must exist')

  const read = (f: string) =>
    fs.readFileSync(path.resolve(import.meta.dirname, f), 'utf8')
  const header = read('../ui/AppHeader.tsx')
  assert.ok(header.includes('flex-wrap'), 'header wraps on narrow viewports')
  assert.ok(read('../ui/SessionActions.tsx').includes('shrink-0'), 'actions stay visible')
  const brand = read('../ui/HeaderBrand.tsx')
  assert.ok(brand.includes('text-ellipsis'), 'header title truncates with ellipsis')
  assert.ok(brand.includes('min-w-0'), 'header flex children may shrink')
})
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
{
const src = (f: string) => readFileSync(new URL(`./${f}`, import.meta.url), 'utf8')
test('narrow header keeps connection text and usage label accessible', () => {
 const connection = src('ConnectionStatusBadge.tsx')
 assert.match(connection, /aria-label=\{label\}/)
 assert.match(connection, /<span>\{label\}<\/span>/)
 const usage = src('UsageButton.tsx')
 assert.match(usage, /aria-label=\{r\.usageTab\}/)
 assert.match(usage, /<span className="hidden sm:inline">\{r\.usageTab\}<\/span>/)
})
}
