import test from 'node:test'
import assert from 'node:assert/strict'
import { statusStyle, statusAccentColor } from './paneStatusBadgeStyle'
test('input uses warning fill and Off White text, distinct from working', () => {
  assert.deepEqual(statusStyle('input_required'), {
    background: 'var(--color-warning)', color: 'var(--color-canvas)',
    border: '1px solid var(--color-warning)',
  })
  assert.equal(statusAccentColor('input_required'), 'var(--color-warning)')
  assert.notDeepEqual(statusStyle('input_required'), statusStyle('working'))
})
