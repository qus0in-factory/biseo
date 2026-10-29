import test from'node:test'
import assert from'node:assert/strict'
import{existsSync,mkdtempSync,rmSync,readdirSync}from'node:fs'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{run}from'./codex-session-hook-run-fixture.js'
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