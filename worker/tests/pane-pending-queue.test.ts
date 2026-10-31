import test from'node:test'
import assert from'node:assert/strict'
import{createFakeD1}from'./fake-d1.js'
import{insertRow}from'./d1-row.js'
import{panePending}from'../infra/d1-pane-pending.js'
test('pane close protects queue lane across owners and releases terminal rows',async()=>{
 const db=createFakeD1()
 for(const status of ['queued','working','blocked','timeout']){
  await insertRow(db,status,'other','original',status)
  assert.ok(await panePending(db,'w1T:p1'))
  await db.prepare("UPDATE timeline_turns SET status='failed' WHERE request_id=?").bind(status).run()
  assert.equal(await panePending(db,'w1T:p1'),null)
 }
})
