import test from 'node:test'
import assert from 'node:assert/strict'
import { usageCheckedMode } from './usageCheckedAt.js'

const w = (checkedAt: string | null) => ({
  window: 'a', usedPercent: 1, resetsAt: null, checkedAt, limitReached: false, source: null,
})

test('checked times group only when every window agrees', () => {
  assert.deepEqual(usageCheckedMode({ provider: 'p', state: 'available', windows: [w('x'), w('x')] }), { mode: 'footer', at: 'x' })
  assert.deepEqual(usageCheckedMode({ provider: 'p', state: 'available', windows: [w('x'), w('y')] }), { mode: 'row' })
  assert.deepEqual(usageCheckedMode({ provider: 'p', state: 'available', windows: [w('x'), w(null)] }), { mode: 'row' })
})
