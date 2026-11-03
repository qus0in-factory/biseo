import test from 'node:test'
import assert from 'node:assert/strict'
import { usageApi } from './usageApi'
import { fakeHttp } from '../test-util/fakeHttp'

test('usage adapter GETs usage with credentials and returns the response JSON unchanged', async t => {
  const payload = { providers: [], updatedAt: '2026-11-03T00:00:00Z' }
  const requests = fakeHttp(t, () => Response.json(payload))
  assert.deepEqual(await usageApi.getUsage(), payload)
  assert.equal(requests.length, 1)
  assert.equal(requests[0].method, 'GET')
  assert.equal(new URL(requests[0].url).pathname, '/api/usage')
  assert.equal(requests[0].credentials, 'same-origin')
  assert.equal(await requests[0].text(), '')
})

test('usage adapter rejects HTTP, invalid JSON and network failures without retry', async t => {
  let respond = () => Response.json({ error: 'unavailable' }, { status: 503 })
  const requests = fakeHttp(t, () => respond())
  await assert.rejects(usageApi.getUsage(), (e: unknown) =>
    (e as { response?: Response }).response?.status === 503)
  respond = () => new Response('not json')
  await assert.rejects(usageApi.getUsage(), SyntaxError)
  respond = () => { throw new TypeError('offline') }
  await assert.rejects(usageApi.getUsage(), TypeError)
  assert.equal(requests.length, 3)
})
