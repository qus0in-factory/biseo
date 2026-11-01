import test from 'node:test'
import assert from 'node:assert/strict'
import {queueFixture} from './queue-fixture.js'
import {claimTurn} from '../infra/d1-queue-claim.js'
import {renewTurn} from '../infra/d1-queue-renew.js'
import {finishTurn} from '../infra/d1-queue-finish.js'
test('expiry and rotated tokens fence renew and completion',async()=>{
 const {db,put}=await queueFixture();await put('a');await put('b')
 await claimTurn(db,'w','p','old',100,10)
 const old={id:'a',token:'old',now:110}
 assert.equal(await renewTurn(db,old,10),false)
 await claimTurn(db,'w','p','new',110,10)
 assert.equal(await finishTurn(db,old,'failed'),false)
 const live={id:'a',token:'new',now:111}
 assert.equal(await renewTurn(db,live,20),true)
 assert.equal(await finishTurn(db,live,'failed','delivery_uncertain'),true)
 assert.equal((await claimTurn(db,'w','p','next',112,10))?.requestId,'b')
})
