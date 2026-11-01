import test from 'node:test'
import assert from 'node:assert/strict'
import {queueFixture} from './queue-fixture.js'
import {claimTurn} from '../infra/d1-queue-claim.js'
import {startTurn} from '../infra/d1-queue-start.js'
import {finishTurn} from '../infra/d1-queue-finish.js'
test('dispatch boundary is one-way and working expiry never authorizes resend',async()=>{
 const {db,put}=await queueFixture();await put('a')
 await claimTurn(db,'w','p','t',100,10)
 const lease={id:'a',token:'t',now:101}
 assert.equal(await startTurn(db,{...lease,token:'wrong'}),false)
 assert.equal(await startTurn(db,lease),true)
 assert.equal(await startTurn(db,lease),false)
 assert.equal(await claimTurn(db,'w','p','new',110,10),null)
 assert.equal(await finishTurn(db,{...lease,now:110},'completed'),false)
})
