import test from 'node:test'
import assert from 'node:assert/strict'
import { parseProviderPolicy, lookupPolicy } from './usage-provider-policy.js'
import cur from './usage-provider-policy.json'

const parse = (r: unknown) => ({ ...parseProviderPolicy(r) })

test('malformed entries ignored or defaulted, cur file kept', () => {
  assert.deepEqual(parse(cur), {
    grok: { staleReasons: [...cur.grok.staleReasons], restoreState: 'unknown' },
  })
  assert.deepEqual(
    parse({ a: { staleReasons: 'no', restoreState: 'typo' }, b: { staleReasons: ['ok', 1] }, c: 'junk' }),
    { a: { staleReasons: [], restoreState: undefined }, b: { staleReasons: ['ok'], restoreState: undefined } },
  )
})

test('inherited keys never resolve, __proto__ is inert', () => {
  const m = parseProviderPolicy(JSON.parse('{"__proto__":{}}'))
  assert.equal(Object.getPrototypeOf(m), null)
  assert.deepEqual(Object.keys(m), ['__proto__'])
  for (const k of ['constructor', 'toString']) assert.equal(lookupPolicy(m, k), undefined)
})
