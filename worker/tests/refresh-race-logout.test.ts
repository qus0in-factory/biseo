import test from 'node:test'
import assert from 'node:assert/strict'
import { refreshFixture } from './refresh-fixture.js'
import { readRefresh, revokeRefresh } from '../infra/refresh-read.js'
import { rotateRefresh } from '../infra/refresh-rotate.js'
import { refreshHash } from '../infra/refresh-secret.js'

test('logout between verification and CAS cannot resurrect the family', async () => {
 const { db, token } = await refreshFixture()
 const hash = await refreshHash(token)
 const s = (await readRefresh(db as any,hash,'biseo.qus0in.dev'))!
 const now = Math.floor(Date.now()/1000)
 await revokeRefresh(db as any,s.id,now)
 assert.equal(await rotateRefresh(db as any,s,hash,'next',now,now+100),false)
 assert.equal(await db.prepare('SELECT generation FROM refresh_sessions').first('generation'),0)
})
