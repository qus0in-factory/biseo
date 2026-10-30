import test from 'node:test'
import assert from 'node:assert/strict'
import { rmSync } from 'node:fs'
import { fetchAgyUsage } from './agy-usage-fetch.js'
import { putAgyTokenFile, agyTestEnv } from './agy-test-support.js'

test('a rejected refresh yields unknown agy_auth_expired with no default metric', async () => {
  const p = putAgyTokenFile('agy129-expired', '2020-01-01T00:00:00.000Z')
  agyTestEnv(p)
  const orig = globalThis.fetch
  globalThis.fetch = (async () => new Response('no', { status: 400 })) as typeof fetch
  try {
    const res = await fetchAgyUsage(new Date('2026-10-30T12:00:00Z'))
    assert.equal(res.state, 'unknown')
    assert.equal(res.reason, 'agy_auth_expired')
    assert.deepEqual(res.metrics, [])
  } finally { globalThis.fetch = orig; rmSync(p) }
})
