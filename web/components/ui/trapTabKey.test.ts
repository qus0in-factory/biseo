import test from 'node:test'
import assert from 'node:assert/strict'
import { trapTabKey } from './trapTabKey'
import { stubGlobal } from '../../test-util/stubGlobal'

test('Tab and Shift+Tab wrap only at the last and first focus boundaries', t => {
  const focused: string[] = []
  const first = { focus: () => focused.push('first') }
  const middle = { focus: () => focused.push('middle') }
  const last = { focus: () => focused.push('last') }
  const doc = { activeElement: last }
  stubGlobal(t, 'document', doc)
  const nodes = [first, middle, last] as unknown as NodeListOf<HTMLElement>
  let prevented = 0
  const key = (shiftKey = false, key = 'Tab') => ({
    key, shiftKey, preventDefault: () => { prevented++ },
  }) as KeyboardEvent
  trapTabKey(key(), nodes)
  doc.activeElement = first
  trapTabKey(key(true), nodes)
  assert.deepEqual(focused, ['first', 'last'])
  assert.equal(prevented, 2)
  doc.activeElement = middle
  trapTabKey(key(), nodes)
  trapTabKey(key(true), nodes)
  doc.activeElement = last
  trapTabKey(key(true), nodes)
  doc.activeElement = first
  trapTabKey(key(), nodes)
  trapTabKey(key(false, 'Escape'), nodes)
  assert.equal(prevented, 2)
  assert.deepEqual(focused, ['first', 'last'])
})

test('missing/empty focus lists do nothing and a single focusable wraps to itself', t => {
  let focused = 0
  let prevented = 0
  const only = { focus: () => { focused++ } }
  stubGlobal(t, 'document', { activeElement: only })
  for (const shiftKey of [false, true]) {
    const e = { key: 'Tab', shiftKey, preventDefault: () => { prevented++ } } as KeyboardEvent
    trapTabKey(e)
    trapTabKey(e, [] as unknown as NodeListOf<HTMLElement>)
    assert.equal(prevented, focused)
    trapTabKey(e, [only] as unknown as NodeListOf<HTMLElement>)
  }
  assert.equal(focused, 2)
  assert.equal(prevented, 2)
})
