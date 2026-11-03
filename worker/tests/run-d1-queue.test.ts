import{test}from'node:test'
import{strict as a}from'node:assert'
import assert from'node:assert/strict'
import {queueFixture} from '../test-util/queue-fixture.js'
import {runD1Queue} from '../app/run-d1-queue.js'
import {claimTurn} from '../infra/d1-queue-claim.js'
import {startTurn} from '../infra/d1-queue-start.js'
import {liveQueueFixture} from '../test-util/live-queue-fixture.js'
import {dispatchQueue} from '../app/dispatch-queue.js'
import {cancelReservation} from '../app/cancel-reservation.js'
import {findTurn} from '../infra/d1-timeline-find.js'

test('restart expires working once and allows its follower without resending',async()=>{
 const{db,put}=await queueFixture();await put('a');await put('b')
 await db.prepare('UPDATE timeline_turns SET created_at=?').bind(new Date().toISOString()).run()
 await claimTurn(db,'w','p','old',0,10)
 await startTurn(db,{id:'a',token:'old',now:1})
 const sent:string[]=[]
 const q={target:async()=>({terminalId:'generation-1',ready:true}),execute:async(r:{requestId:string})=>{sent.push(r.requestId);return true}}
 await runD1Queue(db,q,{getTurn:async()=>({ok:false,status:404,body:{}})} as never)
 a.deepEqual(sent,['b'])
})

test('missed callback recovery persists output and advances remaining FIFO once', async () => {
  const { db, sent, q, completed } = await liveQueueFixture()
  await dispatchQueue(db, q, 'w', 'p')
  await cancelReservation(db, 'middle', 'o')
  const scope = { workspaceId: 'w', ownerSubject: 'o' }
  const first = (await findTurn(db, scope, 'first'))!
  await runD1Queue(db, q, completed(first) as any)
  await runD1Queue(db, q, completed(first) as any)
  assert.deepEqual(sent, ['first', 'last'])
  assert.equal((await findTurn(db, scope, 'first'))?.responseText, 'local result')
  assert.equal((await findTurn(db, scope, 'middle'))?.status, 'cancelled')
})
