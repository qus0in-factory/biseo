import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueFixture}from '../test-util/queue-fixture.js'
import{retryReservation}from'../app/retry-reservation.js'

test('manual retry creates fresh generation and preserves old prompt and failure',async()=>{
 const{db,put}=await queueFixture();await put('old','p','o','original',' hi ')
 await db.prepare("UPDATE timeline_turns SET status='failed',error_code='delivery_uncertain'").run()
 const q={target:async()=>({terminalId:'new',ready:false}),execute:async()=>false}
 const i={requestId:'new',workspaceId:'original',paneId:'q',text:'ignored'}
 a.equal(await retryReservation(db,q,'old',i,'other'),null)
 const r=await retryReservation(db,q,'old',i,'o')
 a.ok(r&&'rec'in r)
 a.equal(r.rec.promptText,' hi ');a.equal(r.rec.terminalId,'new');a.equal(r.rec.paneId,'q')
 a.equal((await db.prepare("SELECT status FROM timeline_turns WHERE request_id='old'").first())?.status,'failed')
})

test('retry rejects pending, same id and cross workspace; fresh retries are idempotent',async()=>{
 const{db,put}=await queueFixture();await put('old')
 const q={target:async()=>null,execute:async()=>false}
 const i={requestId:'new',workspaceId:'w',paneId:'q',text:'hi'}
 a.equal(await retryReservation(db,q,'old',i,'o'),null)
 await db.prepare("UPDATE timeline_turns SET status='failed',error_code='target_unclear'").run()
 a.equal(await retryReservation(db,q,'old',{...i,requestId:'old'},'o'),null)
 a.equal(await retryReservation(db,q,'old',{...i,workspaceId:'other'},'o'),null)
 await retryReservation(db,q,'old',i,'o')
 a.equal((await retryReservation(db,q,'old',i,'o'))?.kind,'existing')
})
