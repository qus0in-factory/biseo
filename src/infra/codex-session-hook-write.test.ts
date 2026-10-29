import test from'node:test'
import assert from'node:assert/strict'
import{mkdtempSync,rmSync}from'node:fs'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{checkWrite}from'./codex-session-hook-write-check-fixture.js'
import{run,file}from'./codex-session-hook-run-fixture.js'
test('writes a private atomic record for the pane',()=>{
 const base=mkdtempSync(join(tmpdir(),'biseo-hook-'))
 try{
  const rec={session_id:'s1',transcript_path:'/home/test/.codex/sessions/2026/01/01/rollout-test.jsonl'}
  const r=run(base,{HERDR_PANE_ID:'w1T:p2'},JSON.stringify(rec))
  assert.equal(r.status,0);assert.equal(r.stdout,'');assert.equal(r.stderr,'')
  checkWrite(base,rec)
 }finally{rmSync(base,{recursive:true,force:true})}
})