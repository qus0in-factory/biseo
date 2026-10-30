import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { getList, getOne } from './d1-requests.js'
import { insertRow } from './d1-row.js'

test('timeline reads stay within owner and workspace scope', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  await insertRow(env.BISEO_DB!, 'other-owner', 'other', 'w1T')
  await insertRow(env.BISEO_DB!, 'other-ws', 'owner', 'otherWs')
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ error: 'not_found' }, { status: 404 })) as any
  try {
    const list: any = await (await app.fetch(getList(cookie), env)).json()
    assert.deepEqual(list.items, [])
    const one = await app.fetch(getOne('other-owner', cookie), env)
    assert.equal(one.status, 404)
  } finally { globalThis.fetch = orig }
})
