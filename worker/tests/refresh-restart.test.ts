import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { refreshFixture, refreshRequest, refreshToken } from './refresh-fixture.js'

test('worker restart needs no in-memory session state', async () => {
 const { env, token } = await refreshFixture()
 const first = await app.fetch(refreshRequest(token),env)
 assert.equal(first.status,200)
 const restarted = await import(new URL('../index.js?restart',import.meta.url).href)
 const second = await restarted.default.fetch(refreshRequest(refreshToken(first)),{...env})
 assert.equal(second.status,200)
})
