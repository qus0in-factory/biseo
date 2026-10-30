import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { getList, post } from './d1-requests.js'
import { body, queued } from './d1-fixtures.js'
import { completed } from './d1-completed.js'

test('timeline GET reconciles a completed result after a disconnect', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  globalThis.fetch = (async (u: any) => {
    const url = typeof u === 'string' ? u : (u?.url ?? String(u))
    return Response.json(url.includes('/herdr/turns/') ? completed : queued, { status: url.includes('/herdr/turns/') ? 200 : 202 })
  }) as any
  try {
    await app.fetch(post(body(), cookie), env)
    const j: any = await (await app.fetch(getList(cookie), env)).json()
    assert.equal(j.items[0].status, 'completed')
    assert.equal(j.items[0].responseText, 'done')
  } finally { globalThis.fetch = orig }
})
