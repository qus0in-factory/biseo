import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('inner buttons stop pointer/mouse/touch drag initiation', () => {
  const bookmark = src('../UsageBookmarkStar.tsx')
  assert.match(bookmark, /onPointerDown=\{stopHintEvent\}/)
  assert.match(bookmark, /onMouseDown=\{stopHintEvent\}/)
  assert.match(bookmark, /onTouchStart=\{stopHintEvent\}/)

  const hint = src('../hintPopoverProps.ts')
  assert.match(hint, /onPointerDown: stopHintEvent/)
  assert.match(hint, /onMouseDown: stopHintEvent/)
  assert.match(hint, /onTouchStart: stopHintEvent/)

  const paneItem = src('../PaneItem.tsx')
  assert.match(paneItem, /select-none/)
})
