import test from 'node:test'
import assert from 'node:assert/strict'
import { hintTriggerEvents } from './hintPopoverProps'

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
