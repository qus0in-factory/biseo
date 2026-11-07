import test from 'node:test'
import assert from 'node:assert/strict'
import { exhaustedPanelHtml } from '../test-util/usagePanelOrder.js'
test('exhausted metric rows keep muted labels and the limit text', () => {
  const html = exhaustedPanelHtml()
  assert.equal((html.match(/truncate text-sm text-muted-foreground/g) ?? []).length, 3)
  assert.doesNotMatch(html, /border-t|border-border/)
  assert.match(html, /한도 도달/)
})
