import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import r from '../resources.json'

test('header contract and assets exist', () => {
  assert.equal(typeof r.title,"string")
  assert.equal(r.title, 'Biseo Workspace')
  assert.equal(typeof r.logout, 'string')
  assert.equal(r.logout, '로그아웃')

  const favPath = path.resolve(import.meta.dirname, '../public/favicon.svg')
  assert.ok(fs.existsSync(favPath), 'favicon.svg must exist')

  const read = (f: string) =>
    fs.readFileSync(path.resolve(import.meta.dirname, f), 'utf8')
  const header = read('../ui/AppHeader.tsx')
  assert.ok(header.includes('flex-wrap'), 'header wraps on narrow viewports')
  assert.ok(header.includes('shrink-0'), 'logout button never shrinks off-screen')
  const brand = read('../ui/HeaderBrand.tsx')
  assert.ok(brand.includes('text-ellipsis'), 'header title truncates with ellipsis')
  assert.ok(brand.includes('min-w-0'), 'header flex children may shrink')
})
