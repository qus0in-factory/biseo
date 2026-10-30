import assert from 'node:assert/strict'
import test from 'node:test'
import { dataOf, readyState } from '../domain/asyncState'
import { loadUsage } from './usageLoad.js'

test('a failed refetch keeps the previously loaded providers', async () => {
  let state = readyState([{ provider: 'p', state: 'available' as const, windows: [] }])
  const setState = (next: any) => {
    state = typeof next === 'function' ? next(state) : next
  }
  await loadUsage({ getUsage: async () => { throw new Error('down') } }, { current: true }, setState)
  assert.equal(state.status, 'error')
  assert.equal(dataOf(state)?.length, 1)
})
