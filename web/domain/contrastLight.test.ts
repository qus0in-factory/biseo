import assert from 'node:assert/strict'
import test from 'node:test'

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
