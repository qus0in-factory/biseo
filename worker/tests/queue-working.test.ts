import test from 'node:test'
import assert from 'node:assert/strict'
import {queueFixture} from './queue-fixture.js'
import {claimTurn} from '../infra/d1-queue-claim.js'
import {startTurn} from '../infra/d1-queue-start.js'
import {finishTurn} from '../infra/d1-queue-finish.js'
test('live dispatch token can finish an uncertain delivery without retry',async()=>{
 const {db,put}=await queueFixture();await put('a');await put('b')
 await claimTurn(db,'w','p','t',100,10)
 const lease={id:'a',token:'t',now:101}
 await startTurn(db,lease)
 assert.equal(await finishTurn(db,lease,'failed','delivery_uncertain'),true)
 assert.equal((await claimTurn(db,'w','p','next',102,10))?.requestId,'b')
})
