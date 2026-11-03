import test from'node:test'
import assert from'node:assert/strict'
import{makeApp}from'./test-util/app-fixture.js'
test('recent pull requires service auth and configured workspace; missing session is empty',async()=>{
 const app=makeApp()
 const path='/herdr/workspaces/w/panes/p/recent'
 const headers={authorization:'Bearer x'}
 assert.equal((await app.request(path,{method:'POST'})).status,401)
 assert.equal((await app.request(path.replace('/w/','/other/'),{method:'POST',headers})).status,403)
 const response=await app.request(path,{method:'POST',headers})
 assert.equal(response.status,200)
 assert.deepEqual(await response.json(),{recent:null})
})
