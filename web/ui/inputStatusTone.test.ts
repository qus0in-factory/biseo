import test from 'node:test'
import assert from 'node:assert/strict'
import { statusStyle, statusAccentColor } from './paneStatusBadgeStyle'
test('input reuses the contrast-tested working token without new colors', () => {
  assert.deepEqual(statusStyle('input_required'), statusStyle('working'))
  assert.equal(statusAccentColor('input_required'), statusAccentColor('working'))
})
