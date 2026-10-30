import test from 'node:test'
import assert from 'node:assert/strict'
import { shownUsageProviders } from './usageShownProviders.js'

test('shown providers follow order and skip hidden', () => {
  const ps = [{ provider: 'a' }, { provider: 'b' }, { provider: 'c' }]
  assert.deepEqual(shownUsageProviders(ps, ['c', 'a'], ['b']).map((p) => p.provider), ['c', 'a'])
  assert.deepEqual(shownUsageProviders(ps, [], []).map((p) => p.provider), ['a', 'b', 'c'])
})
