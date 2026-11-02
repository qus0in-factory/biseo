import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('inner hint buttons stop drag and tabs have drag-safe styling', () => {
  const hint = src('../hintPopoverProps.ts')
  assert.match(hint, /onPointerDown: stopHintEvent/)
  assert.match(hint, /onMouseDown: stopHintEvent/)
  assert.match(hint, /onTouchStart: stopHintEvent/)

  const paneItem = src('../PaneItem.tsx')
  assert.match(paneItem, /select-none/)

  const tabBtn = src('../UsageTabButton.tsx')
  assert.match(tabBtn, /select-none/)
  assert.match(tabBtn, /touch-none/)
})
