import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueFixture}from'./queue-fixture.js'
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
