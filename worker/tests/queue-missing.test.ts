import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueFixture}from'./queue-fixture.js'
import{acceptReservation}from'../app/accept-reservation.js'
test('absent target is durably accepted as unclear, never redirected on replay',async()=>{
 const{db}=await queueFixture()
 let lookup=0
 const q={target:async()=>{lookup++;return null},execute:async()=>false}
 const i={requestId:'a',workspaceId:'old',paneId:'p',text:' hi '}
 const r=await acceptReservation(db,q,i,'o')
 a.equal(r.kind,'accepted')
 a.equal((await db.prepare('SELECT error_code FROM timeline_turns').first())?.error_code,'target_unclear')
 await acceptReservation(db,q,i,'o')
 a.equal(lookup,1)
})
