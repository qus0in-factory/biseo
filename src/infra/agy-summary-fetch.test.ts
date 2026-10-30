import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchAgySummary } from './agy-summary-fetch.js'

test('agy summary uses the hub user agent that returns every group', async () => {
  const orig = globalThis.fetch
  let ua = ''
  globalThis.fetch = (async (_url: string, init?: RequestInit) => {
    ua = String((init?.headers as Record<string, string>)['User-Agent'])
    return Response.json({ groups: [] })
  }) as typeof fetch
  try {
    await fetchAgySummary('token')
  } finally {
    globalThis.fetch = orig
  }
  assert.equal(ua, 'antigravity/hub/2.9.1')
})
