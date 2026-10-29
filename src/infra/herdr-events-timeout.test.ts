import test from'node:test'
import assert from'node:assert/strict'
import {createServer,type Socket}from'node:net'
import {mkdtemp,rm}from'node:fs/promises'
import {tmpdir}from'node:os'
import {join}from'node:path'
import {subscribe}from'./herdr-events.js'
test('fails instead of waiting forever for subscription ack',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'biseo-')),path=join(dir,'h.sock'),sockets:Socket[]=[]
 const server=createServer(s=>{sockets.push(s)})
 await new Promise<void>(r=>server.listen(path,r))
 process.env.HERDR_SOCKET_PATH=path
 try{
  await assert.rejects(subscribe([],()=>{},()=>{},50),/herdr_events_timeout/)
 }finally{
  delete process.env.HERDR_SOCKET_PATH
  for(const s of sockets)s.destroy()
  await new Promise<void>(r=>server.close(()=>r()))
  await rm(dir,{recursive:true,force:true})
 }
})
