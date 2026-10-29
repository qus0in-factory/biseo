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

test('dark mode contrast', () => {
  const bg = '#08090a', card = '#222823', fg = '#f4f7f5', mutedFg = '#a7a2a9', ok = '#15803d', bad = '#b91c1c'
  assert.ok(cr(fg, bg) >= 4.5)
  assert.ok(cr(fg, card) >= 4.5)
  assert.ok(cr(mutedFg, card) >= 4.5)
  assert.ok(cr(mutedFg, card) >= 4.5)
  assert.ok(cr(mutedFg, bg) >= 3)
  assert.ok(cr(fg, ok) >= 4.5)
  assert.ok(cr(fg, bad) >= 4.5)
})
