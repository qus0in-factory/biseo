import test from'node:test'
import assert from'node:assert/strict'
import{mkdtempSync,readFileSync,rmSync}from'node:fs'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{run,file}from'./codex-session-hook-run-fixture.js'
import{fakeHerdr}from'./codex-session-hook-herdr-fixture.js'
test('keeps the env pane when herdr confirms it',()=>{
 const base=mkdtempSync(join(tmpdir(),'biseo-hook-'))
 try{
  const bin=fakeHerdr(base,`  "agent list") echo '{"result":{"agents":[]}}';;\n  "pane list") echo '{"result":{"panes":[{"pane_id":"p"}]}}';;`)
  const r=run(base,{HERDR_PANE_ID:'p',HERDR_WORKSPACE_ID:'w',HERDR_BIN_PATH:bin},JSON.stringify({session_id:'s1',transcript_path:'/home/test/.codex/sessions/a.jsonl'}))
  assert.equal(r.status,0)
  assert.equal(JSON.parse(readFileSync(file(base,'p'),'utf8')).pane_id,'p')
 }finally{rmSync(base,{recursive:true,force:true})}
})