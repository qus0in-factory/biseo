import test from 'node:test'
import assert from 'node:assert/strict'
import { hintTriggerEvents } from './hintPopoverProps'
import { readFileSync } from 'node:fs'
test('hint clicks toggle and isolate selection and drag events', () => {
  for (const open of [false, true]) {
    let next = open, stopped = 0, prevented = 0
    const e = { stopPropagation() { stopped++ }, preventDefault() { prevented++ } }
    const h = hintTriggerEvents(open, value => { next = value })
    h.onPointerDown(e)
    h.onMouseDown(e)
    h.onTouchStart(e)
    h.onKeyDown(e)
    h.onClick(e)
    assert.equal(next, !open)
    assert.equal(stopped, 5)
    assert.equal(prevented, 1)
  }
})
const src = (f: string) => readFileSync(new URL(f, new URL("./sortable/dragButtons.test.ts", import.meta.url).href), 'utf8')

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
