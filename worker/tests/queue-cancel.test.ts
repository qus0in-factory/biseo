import{test}from'node:test'
import{strict as a}from'node:assert'
import{queueFixture}from'./queue-fixture.js'
import{cancelReservation}from'../app/cancel-reservation.js'
import{dispatchQueue}from'../app/dispatch-queue.js'
test('queued cancellation is owner scoped and advances D1 FIFO',async()=>{
 const{db,put}=await queueFixture();await put('a');await put('b')
 a.equal(await cancelReservation(db,'a','other'),null)
 a.equal((await cancelReservation(db,'a','o'))?.status,'cancelled')
 const sent:string[]=[]
 await dispatchQueue(db,{target:async()=>({terminalId:'generation-1',ready:true}),execute:async r=>{sent.push(r.requestId);return true}},'w','p')
 a.deepEqual(sent,['b'])
})
