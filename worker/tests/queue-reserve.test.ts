import test from 'node:test'
import assert from 'node:assert/strict'
import {queueFixture} from './queue-fixture.js'
test('reservation preserves generation and rejects global requestId collisions',async()=>{
 const {db,put}=await queueFixture()
 assert.equal((await put('a')).kind,'inserted')
 const replay=await put('a')
 assert.equal(replay.kind,'existing')
 if(replay.kind==='existing')assert.equal(replay.rec.terminalId,'generation-1')
 for(const args of [['p','other'],['p','o','other'],['p','o','w','changed'],['other']]){
  assert.equal((await put('a',...args)).kind,'conflict')
 }
 const row=await db.prepare('SELECT terminal_id FROM timeline_turns').first()
 assert.equal((row as any).terminal_id,'generation-1')
})
