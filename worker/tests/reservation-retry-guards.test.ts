import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueFixture}from'./queue-fixture.js'
import{retryReservation}from'../app/retry-reservation.js'
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
