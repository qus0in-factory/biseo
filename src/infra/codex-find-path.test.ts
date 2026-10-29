import test from'node:test'
import assert from'node:assert/strict'
import{findRollout}from'./codex-find.js'
import{createAvailability}from'./codex-availability.js'
import type{AgentSession}from'../domain/herdr.js'
import{id,linkId,dirId,setup,teardown}from'./codex-find-path-fixture.js'
test('rollout lookup requires a UUID and stays under the real root',async()=>{
 const c=await setup()
 try{
  assert.equal(await findRollout(id),c.file)
  assert.equal(await findRollout(linkId),null)
  assert.equal(await findRollout(dirId),null)
  assert.equal(await findRollout(`../${id}`),null)
  assert.equal(await findRollout(`${id}/../../etc/passwd`),null)
  const session:AgentSession={source:'herdr:codex',agent:'codex',kind:'id',value:linkId}
  assert.equal((await createAvailability().get(session,new Date('2026-10-29T10:00:00.000Z'))).state,'unknown')
  assert.equal((await createAvailability().get({...session,value:'../../etc/passwd'},new Date('2026-10-29T10:00:00.000Z'))).state,'unknown')
 }finally{await teardown(c)}
})