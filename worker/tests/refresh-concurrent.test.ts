import test from 'node:test'
import assert from 'node:assert/strict'
import { refreshFixture } from './refresh-fixture.js'
import { readRefresh } from '../infra/refresh-read.js'
import { rotateRefresh } from '../infra/refresh-rotate.js'
import { refreshHash } from '../infra/refresh-secret.js'

test('CAS cannot fork a family; stale concurrent use revokes it', async () => {
 const { db, token } = await refreshFixture()
 const hash = await refreshHash(token)
 const s = (await readRefresh(db as any,hash,'biseo.qus0in.dev'))!
 const n = Math.floor(Date.now()/1000)
 assert.equal(await rotateRefresh(db as any,s,hash,'next',n,n+100),true)
 assert.equal(await rotateRefresh(db as any,s,hash,'other',n,n+100),false)
 const row = await db.prepare('SELECT * FROM refresh_sessions').first<any>()
 assert.equal(row.generation,1)
 assert.equal(row.revoked,n)
})
