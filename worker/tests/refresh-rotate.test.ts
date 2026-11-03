import test from 'node:test'
import assert from 'node:assert/strict'
import { refreshFixture } from '../test-util/refresh-fixture.js'
import { readRefresh, revokeRefresh } from '../infra/refresh-read.js'
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

test('logout between verification and CAS cannot resurrect the family', async () => {
 const { db, token } = await refreshFixture()
 const hash = await refreshHash(token)
 const s = (await readRefresh(db as any,hash,'biseo.qus0in.dev'))!
 const now = Math.floor(Date.now()/1000)
 await revokeRefresh(db as any,s.id,now)
 assert.equal(await rotateRefresh(db as any,s,hash,'next',now,now+100),false)
 assert.equal(await db.prepare('SELECT generation FROM refresh_sessions').first('generation'),0)
})
