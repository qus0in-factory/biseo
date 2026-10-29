import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import r from '../resources.json'

test('header contract and assets exist', () => {
  assert.equal(typeof r.title, 'string')
  assert.equal(r.title, 'Biseo Workspace')
  assert.equal(typeof r.logout, 'string')
  assert.equal(r.logout, '로그아웃')

  const favPath = path.resolve(import.meta.dirname, '../public/favicon.svg')
  assert.ok(fs.existsSync(favPath), 'favicon.svg must exist')

  const cssPath = path.resolve(import.meta.dirname, '../header.css')
  assert.ok(fs.existsSync(cssPath), 'header.css must exist')
  const css = fs.readFileSync(cssPath, 'utf8')
  assert.ok(css.includes('flex-wrap: wrap;'))
  assert.ok(css.includes('text-overflow: ellipsis;'))
  assert.ok(css.includes('min-width: 0;'))
})
