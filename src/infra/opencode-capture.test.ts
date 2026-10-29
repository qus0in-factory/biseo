import test from'node:test'
import assert from'node:assert/strict'
import {mkdtempSync as mk,rmSync as rm}from'node:fs'
import {DatabaseSync}from'node:sqlite'
import {beginOpencode}from'./opencode-capture.js'
test('opencode capture reads WAL after begin seq',async()=>{
 const dir=mk('/tmp/o-'),p=dir+'/d',d=new DatabaseSync(p)
 d.exec('PRAGMA journal_mode=WAL;CREATE TABLE session_message(session_id,type,seq,data)')
 const q=d.prepare('INSERT INTO session_message VALUES(?,?,?,?)')
 const w=(t:string,n:number,v:unknown,s='ses_1')=>q.run(s,t,n,JSON.stringify(v))
 w('user',0,{text:'hi'})
 process.env.BISEO_OPENCODE_DB=p
 try{
  assert.equal(beginOpencode('bad','hi'),null)
  const r=beginOpencode('ses_1','hi')!
  setTimeout(()=>{
   w('user',0,{text:'hi'},'ses_2');w('user',1,{text:' hi '})
   w('assistant',2,{content:[{type:'text',text:'ok'}]});w('idle',3,{outcome:'succeeded'})
  },20)
  assert.equal(await r.read(1000),'ok')
 }finally{d.close();delete process.env.BISEO_OPENCODE_DB;rm(dir,{recursive:true})}
})
