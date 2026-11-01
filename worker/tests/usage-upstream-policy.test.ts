import assert from 'node:assert/strict'
import test from 'node:test'
import { upstreamPolicy } from '../infra/upstream-policy.js'
import { agyCliConfig } from '../../src/infra/agy-cli-config.js'

test('only usage gets 30 seconds without retry; general policy is unchanged', () => {
 assert.deepEqual(upstreamPolicy('id', 'GET', '/herdr/usage', 10000), { timeout: 30000, retry: 0 })
 const general = upstreamPolicy('id', 'GET', '/herdr/config', 10000)
 assert.equal(general.timeout, 10000)
 assert.equal(typeof general.retry === 'object' && general.retry.limit, 2)
 assert.equal(upstreamPolicy('id', 'POST', '/herdr/turns', 10000).retry, 0)
 assert.ok(30000 >= agyCliConfig().timeoutMs + 10000)
})
