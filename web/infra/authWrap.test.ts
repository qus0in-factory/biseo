import { test } from 'node:test'
import assert from 'node:assert/strict'
import { authWrap } from './authWrap'

test('refresh rejection is unauthenticated, not a network failure', async () => {
  const error = Object.assign(new Error('refresh'), { response: new Response('', { status: 401 }) })
  await assert.rejects(authWrap(async () => { throw error }), { code: 'authFailed' })
})

test('transport errors remain visible', async () => {
  await assert.rejects(authWrap(async () => { throw new TypeError('fetch failed') }), { code: 'unknown' })
})

test('HTTP failures are not labeled network errors', async () => {
  const error = Object.assign(new Error('server'), { response: new Response('', { status: 503 }) })
  await assert.rejects(authWrap(async () => { throw error }), { code: 'serverError' })
})
