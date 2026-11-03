import test from 'node:test'
import assert from 'node:assert/strict'
import { read } from './test-util/paneCss'
import { vars } from './test-util/paneCss'
import { resolve } from './test-util/paneCss'
import { contrast } from './test-util/paneColor'
const statuses = ['idle', 'working', 'done', 'blocked'] as const

test('summary status text meets DESIGN.md contrast on the canvas', () => {
  const all = {
    ...vars(read('theme-tokens.css')),
    ...vars(read('theme-semantic.css')),
    ...vars(read('theme-status.css')),
  }
  const background = resolve(all.background, all)
  for (const status of statuses) {
    const foreground = resolve(all[`status-${status}`], all)
    assert.ok(contrast(background, foreground) >= 4.5, `${status}: ${foreground} on ${background}`)
  }
})
function lum(h: string) {
  const x = h.replace('#', '')
  const r = [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16) / 255)
  const l = r.map((c) => (c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4))
  return .2126 * l[0] + .7152 * l[1] + .0722 * l[2]
}
function cr(a: string, b: string) {
  const x = lum(a), y = lum(b)
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05)
}

test('light mode contrast', () => {
  assert.ok(cr('#08090a', '#f4f7f5') >= 4.5)
  assert.ok(cr('#575a5e', '#f4f7f5') >= 4.5)
  assert.ok(cr('#575a5e', '#e2e6e3') >= 4.5)
  assert.ok(cr('#575a5e', '#f4f7f5') >= 3)
})
