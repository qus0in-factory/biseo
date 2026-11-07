import test from 'node:test'
import assert from 'node:assert/strict'
import { parseProviderPolicy } from './usage-provider-policy.js'
import current from './usage-provider-policy.json'

test('malformed policy entries are ignored or defaulted, current file is kept as-is', () => {
  assert.deepEqual(parseProviderPolicy(current), {
    grok: { staleReasons: ['temporarily_unavailable', 'schema_error'], restoreState: 'unknown' },
  })
  assert.deepEqual(
    parseProviderPolicy({
      a: { staleReasons: 'not-an-array', restoreState: 'typo' },
      b: { staleReasons: ['ok', 1, null], restoreState: 'limited' },
      c: 'junk',
      d: ['x'],
      e: null,
    }),
    { a: { staleReasons: [], restoreState: undefined }, b: { staleReasons: ['ok'], restoreState: 'limited' } },
  )
  assert.deepEqual(parseProviderPolicy(null), {})
  assert.deepEqual(parseProviderPolicy([1]), {})
})
