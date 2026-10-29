import test from'node:test'
import assert from'node:assert/strict'
import{existsSync,mkdtempSync,rmSync,readdirSync}from'node:fs'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{run}from'./codex-session-hook-run-fixture.js'
import{fakeHerdr}from'./codex-session-hook-herdr-fixture.js'
test('skips the record when a stale pane cannot be verified',()=>{
 const base=mkdtempSync(join(tmpdir(),'biseo-hook-'))
 try{
  const bin=fakeHerdr(base,`  "agent list") echo '{"result":{"agents":[]}}';;`)
  const r=run(base,{HERDR_PANE_ID:'wW:p5',HERDR_WORKSPACE_ID:'wW',HERDR_BIN_PATH:bin},JSON.stringify({session_id:'s1',transcript_path:'/home/test/.codex/sessions/a.jsonl'}))
  assert.equal(r.status,0)
  assert.equal(existsSync(join(base,'codex'))?readdirSync(join(base,'codex')).length:0,0)
 }finally{rmSync(base,{recursive:true,force:true})}
})