import test from'node:test'
import assert from'node:assert/strict'
import{chmodSync,mkdirSync,mkdtempSync,rmSync,statSync}from'node:fs'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{run}from'./codex-session-hook-run-fixture.js'
test('repairs an existing state directory to 0700',()=>{
 const base=mkdtempSync(join(tmpdir(),'biseo-hook-'))
 try{
  const dir=join(base,'codex');mkdirSync(dir,{recursive:true});chmodSync(dir,0o755)
  const r=run(base,{HERDR_PANE_ID:'p'},JSON.stringify({session_id:'s1',transcript_path:'/home/test/.codex/sessions/a.jsonl'}))
  assert.equal(r.status,0)
  assert.equal(statSync(dir).mode&0o777,0o700)
 }finally{rmSync(base,{recursive:true,force:true})}
})