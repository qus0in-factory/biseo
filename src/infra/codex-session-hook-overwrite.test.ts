import test from'node:test'
import assert from'node:assert/strict'
import{mkdtempSync,readFileSync,rmSync,readdirSync}from'node:fs'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{run,file}from'./codex-session-hook-run-fixture.js'
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