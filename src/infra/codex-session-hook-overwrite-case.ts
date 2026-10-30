import assert from'node:assert/strict'
import{readFileSync,readdirSync}from'node:fs'
import{join}from'node:path'
import{base}from'./codex-session-hook-fixture.js'
import{run,file}from'./codex-session-hook-run-fixture.js'
export const overwriteCase={
 name:'overwrites without leaving temp files',
 run:()=>base(dir=>{
  const p='/home/test/.codex/sessions/a.jsonl'
  assert.equal(run(dir,{HERDR_PANE_ID:'p'},JSON.stringify({session_id:'s1',transcript_path:p})).status,0)
  assert.equal(run(dir,{HERDR_PANE_ID:'p'},JSON.stringify({session_id:'s2',transcript_path:p})).status,0)
  assert.equal(JSON.parse(readFileSync(file(dir,'p'),'utf8')).session_id,'s2')
  assert.deepEqual(readdirSync(join(dir,'codex')),['70.json'])
 }),
}
