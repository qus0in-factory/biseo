import test from 'node:test'
import assert from 'node:assert/strict'
import { read, vars, resolve } from './paneCss.js'
import { contrast } from './paneColor.js'

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
