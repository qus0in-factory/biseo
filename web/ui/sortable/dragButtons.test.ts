import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('inner hint buttons stop drag and provider rows have drag-safe styling', () => {
  const hint = src('../hintPopoverProps.ts')
  assert.match(hint, /onPointerDown: stopHintEvent/)
  assert.match(hint, /onMouseDown: stopHintEvent/)
  assert.match(hint, /onTouchStart: stopHintEvent/)

  const paneItem = src('../PaneItem.tsx')
  assert.match(paneItem, /select-none/)

  const settingRow = src('../UsageProviderSettingRow.tsx')
  assert.match(settingRow, /select-none/)
  assert.match(settingRow, /touch-none/)
})
