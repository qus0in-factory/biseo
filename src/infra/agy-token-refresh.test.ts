import test from 'node:test'
import assert from 'node:assert/strict'
import { refreshAgyToken } from './agy-token-refresh.js'

test('refresh posts the grant and resolves the new expiry', async () => {
  const orig = globalThis.fetch
  let body = ''
  process.env.BISEO_AGY_TOKEN_URL = 'https://token.example/o'
  process.env.BISEO_AGY_CLIENT_ID = 'synthetic-id'
  globalThis.fetch = (async (_u: string, init?: RequestInit) => {
    body = String(init?.body)
    return Response.json({ access_token: 'synthetic-new', expires_in: 3600 })
  }) as typeof fetch
  try {
    const r = await refreshAgyToken('synthetic-refresh', 1000)
    assert.equal(r?.access, 'synthetic-new')
    assert.equal(r?.expiresAt, 1000 + 3600 * 1000)
    assert.match(body, /grant_type=refresh_token/)
  } finally { globalThis.fetch = orig }
})
