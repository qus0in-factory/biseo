import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { Hono } from 'hono'
import { securityHeaders } from '../ui/security-headers.js'
import { SECURITY_HEADERS } from '../../shared/domain/security-headers.js'

test('the worker sends every shared security header', async () => {
  const app = new Hono()
  app.use('*', securityHeaders)
  app.get('/', (c) => c.text('ok'))
  const res = await app.request('https://biseo.example/')
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    assert.equal(res.headers.get(name), value)
  }
  assert.doesNotMatch(res.headers.get('content-security-policy') ?? '', /script-src[^;]*unsafe-inline/)
})

test('the static asset header file mirrors the shared headers', () => {
  const file = readFileSync(new URL('../../web/public/_headers', import.meta.url).pathname).toString('utf8')
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    assert.ok(file.includes(`${name}: ${value}`))
  }
})
