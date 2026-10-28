import test from'node:test'
import assert from'node:assert/strict'
import {createServer}from'node:net'
import {mkdtemp,rm}from'node:fs/promises'
import {tmpdir}from'node:os'
import {join}from'node:path'
import {subscribe}from'./herdr-events.js'
test('subscribes and emits only event names',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'biseo-')),path=join(dir,'h.sock')
 const server=createServer(s=>s.once('data',()=>s.write('{"id":"sub","result":{"type":"subscription_started"}}\n{"event":"pane_agent_status_changed","data":{"secret":"x"}}\n')))
 await new Promise<void>(r=>server.listen(path,r))
 process.env.HERDR_SOCKET_PATH=path
 try{
  let resolveGot:(s:string)=>void=()=>{}
  const got=new Promise<string>(r=>{resolveGot=r})
  const unsub=await subscribe([],e=>resolveGot(e),()=>{},1000)
  assert.equal(await got,'pane_agent_status_changed')
  unsub()
 }finally{
  delete process.env.HERDR_SOCKET_PATH
  await new Promise<void>(r=>server.close(()=>r()))
  await rm(dir,{recursive:true,force:true})
 }
})
