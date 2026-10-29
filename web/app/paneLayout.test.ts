import test from 'node:test'
import assert from 'node:assert/strict'
import { read, rule } from './paneCss.js'
import { px, sides } from './paneColor.js'

const avail = rule(read('panes.css'), '.pane-availability')
const sum = rule(read('reason.css'), '.reason-details summary')

test('availability and reason icons keep a 20px visual box', () => {
  assert.equal(px(avail.width), 20)
  assert.equal(px(avail.height), 20)
  assert.equal(px(sum.width), 20)
  assert.equal(px(sum.height), 20)
})

test('reason has a 44px hit target without moving the 20px icon', () => {
  const p = sides(sum.padding)
  const m = sides(sum.margin)
  assert.equal(sum['box-sizing'], 'content-box')
  assert.equal(px(sum.width) + p[1], 44)
  assert.equal(px(sum.height) + p[0] + p[2], 44)
  assert.equal(px(sum.width) + p[1] + p[3] + m[1] + m[3], 20)
  assert.equal(px(sum.height) + p[0] + p[2] + m[0] + m[2], 20)
  assert.deepEqual(m, [-12, -24, -12, 0])
})
