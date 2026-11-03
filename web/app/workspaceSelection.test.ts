import assert from 'node:assert/strict'
import test from 'node:test'
import { applySelectedWorkspace } from './workspaceSelection.js'
import { createSelectionGate } from './workspaceSelection.js'

test('only the latest selection token is current', () => {
  const gate = createSelectionGate()
  const first = gate.begin()
  const second = gate.begin()
  assert.equal(gate.isCurrent(first), false)
  assert.equal(gate.isCurrent(second), true)
})

test('applies a current success once', () => {
  const gate = createSelectionGate()
  const token = gate.begin()
  const applied: string[] = []
  assert.equal(applySelectedWorkspace(gate, token, 'w2', (id) => applied.push(id)), true)
  assert.deepEqual(applied, ['w2'])
})

test('ignores a stale success so the latest choice wins', () => {
  const gate = createSelectionGate()
  const first = gate.begin()
  const second = gate.begin()
  const applied: string[] = []
  applySelectedWorkspace(gate, first, 'w2', (id) => applied.push(id))
  applySelectedWorkspace(gate, second, 'w3', (id) => applied.push(id))
  assert.deepEqual(applied, ['w3'])
})
