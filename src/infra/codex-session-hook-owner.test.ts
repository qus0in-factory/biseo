import test from'node:test'
import assert from'node:assert/strict'
import{existsSync,mkdtempSync,readFileSync,rmSync}from'node:fs'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{run,file}from'./codex-session-hook-run-fixture.js'
import{fakeHerdr}from'./codex-session-hook-herdr-fixture.js'
test('uses the herdr session owner when the daemon pane is stale',()=>{
 const base=mkdtempSync(join(tmpdir(),'biseo-hook-'))
 try{
  const bin=fakeHerdr(base,`  "agent list") echo '{"result":{"agents":[{"pane_id":"w1T:p1","agent_session":{"value":"s1"}}]}}';;`)
  const r=run(base,{HERDR_PANE_ID:'wW:p5',HERDR_WORKSPACE_ID:'wW',HERDR_BIN_PATH:bin},JSON.stringify({session_id:'s1',transcript_path:'/home/test/.codex/sessions/a.jsonl'}))
  assert.equal(r.status,0)
  assert.equal(JSON.parse(readFileSync(file(base,'w1T:p1'),'utf8')).pane_id,'w1T:p1')
  assert.equal(existsSync(file(base,'wW:p5')),false)
 }finally{rmSync(base,{recursive:true,force:true})}
})