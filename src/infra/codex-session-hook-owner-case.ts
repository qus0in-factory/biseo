import assert from'node:assert/strict'
import{existsSync,readFileSync}from'node:fs'
import{base,spawn}from'./codex-session-hook-fixture.js'
import{file}from'./codex-session-hook-run-fixture.js'
export const ownerCase={
 name:'uses the herdr session owner when the daemon pane is stale',
 run:()=>base(dir=>{
  const r=spawn(dir,{HERDR_PANE_ID:'wW:p5',HERDR_WORKSPACE_ID:'wW'},`  "agent list") echo '{"result":{"agents":[{"pane_id":"w1T:p1","agent_session":{"value":"s1"}}]}}';;`)
  assert.equal(r.status,0)
  assert.equal(JSON.parse(readFileSync(file(dir,'w1T:p1'),'utf8')).pane_id,'w1T:p1')
  assert.equal(existsSync(file(dir,'wW:p5')),false)
 }),
}
