import test from 'node:test'
import assert from 'node:assert/strict'
import{strict as a}from'node:assert'
import {queueFixture} from '../test-util/queue-fixture.js'
import {claimTurn} from '../infra/d1-queue-claim.js'
import {renewTurn} from '../infra/d1-queue-renew.js'
import {finishTurn} from '../infra/d1-queue-finish.js'
import {startTurn} from '../infra/d1-queue-start.js'
import {recoverQueue} from '../infra/d1-queue-recover.js'
import {applyQueueResult} from '../infra/d1-queue-result.js'

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

test('live dispatch token can finish an uncertain delivery without retry',async()=>{
 const {db,put}=await queueFixture();await put('a');await put('b')
 await claimTurn(db,'w','p','t',100,10)
 const lease={id:'a',token:'t',now:101}
 await startTurn(db,lease)
 assert.equal(await finishTurn(db,lease,'failed','delivery_uncertain'),true)
 assert.equal((await claimTurn(db,'w','p','next',102,10))?.requestId,'b')
})

test('late completion cannot resurrect expired working',async()=>{
 const{db,put}=await queueFixture();await put('a')
 const r=(await claimTurn(db,'w','p','token',0,10))!
 await startTurn(db,{id:'a',token:'token',now:1})
 await recoverQueue(db,11)
 await applyQueueResult(db,r,'token',{...r,status:'completed',seq:1})
 a.equal((await db.prepare('SELECT error_code FROM timeline_turns').first())?.error_code,'delivery_uncertain')
})
