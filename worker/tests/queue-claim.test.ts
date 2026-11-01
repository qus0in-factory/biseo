import test from 'node:test'
import assert from 'node:assert/strict'
import {queueFixture} from './queue-fixture.js'
import {claimTurn} from '../infra/d1-queue-claim.js'
test('atomic panel FIFO blocks followers, but not other panels or owners',async()=>{
 const {db,put}=await queueFixture()
 await put('a');await put('b','p','other');await put('c','q')
 const claims=await Promise.all(['x','y'].map(t=>claimTurn(db,'w','p',t,100,10)))
 assert.equal(claims.filter(Boolean).length,1)
 assert.equal(claims.find(Boolean)?.requestId,'a')
 assert.equal(await claimTurn(db,'w','p','z',101,10),null)
 assert.equal((await claimTurn(db,'w','q','q',101,10))?.requestId,'c')
 assert.equal((await claimTurn(db,'w','p','z',110,10))?.requestId,'a')
})
