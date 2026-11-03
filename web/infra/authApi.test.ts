import test from 'node:test'
import assert from 'node:assert/strict'
import { authApi } from './authApi'
import { ApiError } from '../domain/auth'
import { fakeHttp } from '../test-util/fakeHttp'
import { stubGlobal } from '../test-util/stubGlobal'

test('auth adapters send password/PIN/session/logout method, path, credentials and body', async t => {
  const requests = fakeHttp(t, () => new Response(null, { status: 204 }))
  stubGlobal(t, 'navigator', { locks: { request: async (_: string, fn: () => unknown) => fn() } })
  const events: string[] = []
  stubGlobal(t, 'window', { dispatchEvent: (e: Event) => events.push(e.type) })
  stubGlobal(t, 'localStorage', { setItem() {} })
  await authApi.login('secret')
  await authApi.loginPin('0123')
  await authApi.session()
  await authApi.logout()
  assert.deepEqual(requests.map(r => [r.method, new URL(r.url).pathname, r.credentials]), [
    ['POST', '/api/login', 'same-origin'], ['POST', '/api/login/pin', 'same-origin'],
    ['GET', '/api/session', 'same-origin'], ['POST', '/api/logout', 'same-origin'],
  ])
  assert.deepEqual(await requests[0].json(), { password: 'secret' })
  assert.deepEqual(await requests[1].json(), { pin: '0123' })
  assert.equal(await requests[2].text(), '')
  assert.equal(await requests[3].text(), '')
  assert.equal(requests[3].headers.get('X-Biseo-CSRF'), '1')
  assert.deepEqual(events, ['biseo-session-expired'])
})

test('auth adapters map unauthorized/server/network failures without retrying login', async t => {
  let status = 401
  const requests = fakeHttp(t, () => {
    if (!status) throw new TypeError('offline')
    return Response.json({ error: 'denied' }, { status })
  })
  const expected = (code: string) => (e: unknown) => e instanceof ApiError && e.code === code
  await assert.rejects(authApi.login('bad'), expected('authFailed'))
  status = 500
  await assert.rejects(authApi.loginPin('bad'), expected('serverError'))
  await assert.rejects(authApi.session(), expected('serverError'))
  status = 0
  await assert.rejects(authApi.login('offline'), expected('unknown'))
  assert.equal(requests.length, 4)
})
