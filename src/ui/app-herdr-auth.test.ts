import test from'node:test'
import assert from'node:assert/strict'
import {auth}from'./app-data-fixture.js'
import {makeApp}from'./app-fixture.js'
const app=makeApp()
test('herdr routes require permission and workspace allowlist',async()=>{
 assert.equal((await app.request('/herdr/workspaces/w/panes')).status,401)
 assert.equal((await app.request('/herdr/workspaces/w/panes',{headers:auth})).status,200)
 assert.equal((await app.request('/herdr/workspaces/x/panes',{headers:auth})).status,403)
})
