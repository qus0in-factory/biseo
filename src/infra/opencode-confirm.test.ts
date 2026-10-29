import test from'node:test'
import assert from'node:assert/strict'
import {mkdtempSync as mk,rmSync as rm}from'node:fs'
import {DatabaseSync}from'node:sqlite'
import {beginOpencode}from'./opencode-capture.js'
test('opencode confirm sees the user row after begin',async()=>{
 const dir=mk('/tmp/o-'),p=dir+'/d',d=new DatabaseSync(p)
 d.exec('PRAGMA journal_mode=WAL;CREATE TABLE session_message(session_id,type,seq,data)')
 const q=d.prepare('INSERT INTO session_message VALUES(?,?,?,?)')
 q.run('ses_1','user',0,JSON.stringify({text:'old'}))
 process.env.BISEO_OPENCODE_DB=p
 try{
  const r=beginOpencode('ses_1','hi')!
  assert.equal(await r.confirm!(),false)
  q.run('ses_1','user',1,JSON.stringify({text:'hi'}))
  assert.equal(await r.confirm!(),true)
 }finally{d.close();delete process.env.BISEO_OPENCODE_DB;rm(dir,{recursive:true})}
})
