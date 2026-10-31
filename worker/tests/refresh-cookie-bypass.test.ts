import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { refreshFixture, refreshRequest } from './refresh-fixture.js'

test('body tokens and malformed cookies cannot replace the HttpOnly refresh cookie', async () => {
 const { env, token } = await refreshFixture()
 const req = refreshRequest(token)
 req.headers.delete('Cookie')
 const body = new Request(req,{body:JSON.stringify({refreshToken:token})})
 assert.equal((await app.fetch(body,env)).status,401)
 assert.equal((await app.fetch(refreshRequest('invalid'),env)).status,401)
 const http = refreshRequest(token,'/api/refresh','http://biseo.qus0in.dev')
 assert.equal((await app.fetch(http,env)).status,403)
})
