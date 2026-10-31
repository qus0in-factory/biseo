import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { getList } from './d1-requests.js'
import { workingRow } from './queue-working-fixture.js'
import { completed } from './d1-completed.js'

test('timeline GET reconciles a completed result after a disconnect', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json(completed)) as any
  try {
    await workingRow(env.BISEO_DB!)
    const j: any = await (await app.fetch(getList(cookie), env)).json()
    assert.equal(j.items[0].status, 'completed')
    assert.equal(j.items[0].responseText, 'done')
  } finally { globalThis.fetch = orig }
})
