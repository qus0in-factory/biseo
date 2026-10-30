import assert from'node:assert/strict'
import{base}from'./codex-session-hook-fixture.js'
import{run}from'./codex-session-hook-run-fixture.js'
import{checkWrite}from'./codex-session-hook-write-check-fixture.js'
export const writeCase={
 name:'writes a private atomic record for the pane',
 run:()=>base(dir=>{
  const rec={session_id:'s1',transcript_path:'/home/test/.codex/sessions/2026/01/01/rollout-test.jsonl'}
  const r=run(dir,{HERDR_PANE_ID:'w1T:p2'},JSON.stringify(rec))
  assert.equal(r.status,0)
  assert.equal(r.stdout,'')
  assert.equal(r.stderr,'')
  checkWrite(dir,rec)
 }),
}
