import test from'node:test'
import assert from'node:assert/strict'
import {spawnSync}from'node:child_process'
import {existsSync,mkdtempSync,readdirSync,readFileSync,rmSync,statSync}from'node:fs'
import {tmpdir}from'node:os'
import {join}from'node:path'
import {fileURLToPath}from'node:url'
const script=fileURLToPath(new URL('../../scripts/codex-session-hook.sh',import.meta.url))
const run=(base:string,env:Record<string,string>,input:string)=>spawnSync('sh',[script],{input,encoding:'utf8',env:{...process.env,BISEO_STATE_DIR:base,...env}})
const file=(base:string,pane:string)=>join(base,'codex',Buffer.from(pane).toString('hex')+'.json')
test('writes a private atomic record for the pane',()=>{
 const base=mkdtempSync(join(tmpdir(),'biseo-hook-'))
 try{
  const rec={session_id:'s1',transcript_path:'/home/test/.codex/sessions/2026/01/01/rollout-test.jsonl'}
  const r=run(base,{HERDR_PANE_ID:'w1T:p2'},JSON.stringify(rec))
  assert.equal(r.status,0);assert.equal(r.stdout,'');assert.equal(r.stderr,'')
  const path=file(base,'w1T:p2')
  const got=JSON.parse(readFileSync(path,'utf8'))
  assert.equal(got.session_id,'s1');assert.equal(got.transcript_path,rec.transcript_path);assert.equal(got.pane_id,'w1T:p2')
  assert.ok(Number.isInteger(got.pid)&&got.pid>1)
  assert.ok(typeof got.created_at==='number'&&Math.abs(Date.now()-got.created_at)<10000)
  assert.equal(statSync(path).mode&0o777,0o600)
  assert.deepEqual(readdirSync(join(base,'codex')),['7731543a7032.json'])
 }finally{rmSync(base,{recursive:true,force:true})}
})
test('overwrites without leaving temp files',()=>{
 const base=mkdtempSync(join(tmpdir(),'biseo-hook-'))
 try{
  const p='/home/test/.codex/sessions/a.jsonl'
  assert.equal(run(base,{HERDR_PANE_ID:'p'},JSON.stringify({session_id:'s1',transcript_path:p})).status,0)
  assert.equal(run(base,{HERDR_PANE_ID:'p'},JSON.stringify({session_id:'s2',transcript_path:p})).status,0)
  assert.equal(JSON.parse(readFileSync(file(base,'p'),'utf8')).session_id,'s2')
  assert.deepEqual(readdirSync(join(base,'codex')),['70.json'])
 }finally{rmSync(base,{recursive:true,force:true})}
})
test('silently ignores missing pane or invalid input',()=>{
 const cases:[Record<string,string>,string][]=[
  [{HERDR_PANE_ID:''},JSON.stringify({session_id:'s1',transcript_path:'/x'})],
  [{HERDR_PANE_ID:'p'},'{bad'],
  [{HERDR_PANE_ID:'p'},JSON.stringify({session_id:'s1',transcript_path:'relative'})],
  [{HERDR_PANE_ID:'p'},JSON.stringify({session_id:'../x',transcript_path:'/x'})],
 ]
 for(const [env,input]of cases){
  const base=mkdtempSync(join(tmpdir(),'biseo-hook-'))
  try{
   const r=run(base,env,input)
   assert.equal(r.status,0);assert.equal(r.stdout,'');assert.equal(r.stderr,'')
   assert.equal(existsSync(join(base,'codex'))?readdirSync(join(base,'codex')).length:0,0)
  }finally{rmSync(base,{recursive:true,force:true})}
 }
})
