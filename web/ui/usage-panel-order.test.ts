import test from 'node:test'
import assert from 'node:assert/strict'
import { exhaustedPanelHtml } from '../test-util/usagePanelOrder.js'
test('metric rows retain order and label only exhausted rows', () => {
  const html = exhaustedPanelHtml()
  assert.ok(html.indexOf('row0') < html.indexOf('row1'))
  assert.ok(html.indexOf('row1') < html.indexOf('row2'))
  assert.equal((html.match(/sr-only/g) ?? []).length, 1)
  assert.equal((html.match(/text-danger/g) ?? []).length, 1)
  assert.doesNotMatch(html, /text-error/)
})
