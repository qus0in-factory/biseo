import test from 'node:test'
import assert from 'node:assert/strict'
import { read, vars, rule, resolve } from './paneCss.js'
import { contrast } from './paneColor.js'

const v = vars(read('theme.css'))
const css = read('pane-status.css')
const names = ['idle', 'working', 'done', 'blocked', 'unknown']
const rules = names.map((s) => rule(css, `.pane-badge.status-${s}`))
const val = (r: Record<string, string>, k: string) => resolve(r[k], v)

test('status text and boundaries meet WCAG contrast', () => {
  for (const [i, r] of rules.entries()) {
    const bg = val(r, 'background')
    assert.ok(!JSON.stringify(r).includes('#'), `${names[i]} must use tokens`)
    assert.ok(contrast(bg === 'transparent' ? '#FFFFFF' : bg, val(r, 'color')) >= 4.5)
    const edge =
      bg === 'transparent' || bg === '#F4F7F5'
        ? val(r, 'border').match(/#[0-9A-Fa-f]{6}/)![0]
        : bg
    assert.ok(contrast('#FFFFFF', edge) >= 3, `${names[i]} boundary`)
  }
})
