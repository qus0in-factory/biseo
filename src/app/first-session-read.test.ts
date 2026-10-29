import test from'node:test'
import assert from'node:assert/strict'
import{mkdtempSync as mk,rmSync as rm}from'node:fs'
import{DatabaseSync}from'node:sqlite'
import{beginFirstReader}from'./first-session-reader.js'
import type{Target}from'../domain/turn-policy.js'
const pane={pane_id:'w:p1',tab_id:'t',workspace_id:'w',terminal_id:'term',agent_status:'idle' as const,agent:'opencode',revision:1}
const noSes:Target={pane}
const ses={source:'herdr:opencode',agent:'opencode',kind:'id' as const,value:'ses_9'}
test('first reader collects rows written before session report',async()=>{
 const dir=mk('/tmp/f-'),p=dir+'/d',db=new DatabaseSync(p)
 db.exec('CREATE TABLE session_message(session_id,type,seq,data)')
 const ins=db.prepare('INSERT INTO session_message VALUES(?,?,?,?)')
 ins.run('ses_9','user',0,JSON.stringify({text:'hi'}))
 ins.run('ses_9','assistant',1,JSON.stringify({content:[{type:'text',text:'ok'}]}))
 ins.run('ses_9','idle',2,JSON.stringify({outcome:'succeeded'}))
 const full={pane_id:'w:p1',terminal_id:'term',agent_status:'idle',agent:'opencode',agent_session:ses}
 const herdr={listPanes:async()=>[],listAgents:async()=>[],getPane:async()=>full,getAgent:async()=>undefined,prompt:async()=>{}}
 let subCalls=0
 const sub=async()=>()=>{subCalls++}
 process.env.BISEO_OPENCODE_DB=p
 try{
  const r=beginFirstReader({herdr:herdr as never,firstSessionMs:50,sub},noSes,'hi')!
  assert.equal(await r.read(1000),'ok')
  assert.equal(subCalls,0)
 }finally{db.close();delete process.env.BISEO_OPENCODE_DB;rm(dir,{recursive:true})}
})
