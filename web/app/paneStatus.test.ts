import test from 'node:test'
import assert from 'node:assert/strict'
import { read, vars, rule, resolve } from './paneCss.js'
import { contrast } from './paneColor.js'

const v = vars(read('theme.css'))
const css = read('pane-status.css')
const names = ['idle', 'working', 'done', 'blocked', 'unknown']
const [idle, working, done, blocked, unknown] = names.map((s) =>
  rule(css, `.pane-badge.status-${s}`),
)
const val = (r: Record<string, string>, k: string) => resolve(r[k], v)

test('status badges use five distinct design-token treatments', () => {
  const sigs = [idle, working, done, blocked, unknown].map((r) =>
    ['background', 'color', 'border'].map((k) => val(r, k)).join('|'),
  )
  assert.equal(new Set(sigs).size, 5)
  assert.notEqual(val(done, 'background'), val(blocked, 'background'))
  assert.ok(contrast('#FFFFFF', val(working, 'background')) >= 3)
  assert.match(read('panes.css'), /pane-status\.css/)
})
