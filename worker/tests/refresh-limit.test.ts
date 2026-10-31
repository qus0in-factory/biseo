import test from 'node:test'
import assert from 'node:assert/strict'
import { refreshFixture } from './refresh-fixture.js'
import { startRefresh } from '../app/refresh-start.js'
import { refreshSource } from '../infra/refresh-source.js'
import { refreshPolicy } from '../ui/refresh-policy.js'

test('session cap is enforced; expired families and token history are cleaned', async () => {
 const { env, db } = await refreshFixture()
 const p = { ...refreshPolicy(env), maximum:1, retention:1 }
 const start = () => startRefresh(refreshSource(db as any),p,'biseo.qus0in.dev','owner','password',900)
 await assert.rejects(start())
 await db.prepare('UPDATE refresh_sessions SET expires=1').run()
 await start()
 assert.equal(await db.prepare('SELECT count(*) n FROM refresh_sessions').first('n'),1)
 assert.equal(await db.prepare('SELECT count(*) n FROM refresh_tokens').first('n'),1)
})
