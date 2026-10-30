import assert from'node:assert/strict'
import{readFileSync}from'node:fs'
import{base,spawn}from'./codex-session-hook-fixture.js'
import{file}from'./codex-session-hook-run-fixture.js'
export const envCase={
 name:'keeps the env pane when herdr confirms it',
 run:()=>base(dir=>{
  const r=spawn(dir,{HERDR_PANE_ID:'p',HERDR_WORKSPACE_ID:'w'},`  "agent list") echo '{"result":{"agents":[]}}';;\n  "pane list") echo '{"result":{"panes":[{"pane_id":"p"}]}}';;`)
  assert.equal(r.status,0)
  assert.equal(JSON.parse(readFileSync(file(dir,'p'),'utf8')).pane_id,'p')
 }),
}
