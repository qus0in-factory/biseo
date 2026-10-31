import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { refreshFixture, refreshRequest, origin } from './refresh-fixture.js'
import { startRefresh } from '../app/refresh-start.js'
import { refreshSource } from '../infra/refresh-source.js'
import { refreshPolicy } from '../ui/refresh-policy.js'
import { seedTrusted } from './pin-seed.js'

test('PIN refresh is denied on workers.dev even with a valid host-bound family', async () => {
 const { env, db } = await refreshFixture()
 const host = 'https://biseo.qus0in.workers.dev'
 env.ALLOWED_ORIGINS = `${origin},${host}`
 await seedTrusted(db,'1.2.3.4')
 const r = await startRefresh(refreshSource(db as any),refreshPolicy(env),new URL(host).host,'owner','pin',900)
 assert.equal((await app.fetch(refreshRequest(r.token,'/api/refresh',host),env)).status,401)
})
