import test from 'node:test'
import assert from 'node:assert/strict'
import {queueFixture} from './queue-fixture.js'
import {claimTurn} from '../infra/d1-queue-claim.js'
test('unknown generation and working head cannot be skipped',async()=>{
 const {db,put}=await queueFixture();await put('a');await put('b')
 await db.prepare('UPDATE timeline_turns SET terminal_id=NULL WHERE request_id=?').bind('a').run()
 assert.equal(await claimTurn(db,'w','p','t',100,10),null)
 await db.prepare("UPDATE timeline_turns SET status='working' WHERE request_id=?").bind('a').run()
 assert.equal(await claimTurn(db,'w','p','t',100,10),null)
 await db.prepare("UPDATE timeline_turns SET status='cancelled' WHERE request_id=?").bind('a').run()
 assert.equal(await claimTurn(db,'other','p','t',100,10),null)
 assert.equal((await claimTurn(db,'w','p','t',100,10))?.requestId,'b')
})
