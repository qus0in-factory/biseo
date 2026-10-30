import assert from'node:assert/strict'
import{base,recordCount,spawn}from'./codex-session-hook-fixture.js'
const rows=[
 {
  name:'skips when the workspace is missing',
  herdr:`  "agent list") echo '{"result":{"agents":[]}}';;\n  "pane list") echo '{"result":{"panes":[{"pane_id":"p"}]}}';;`,
  env:{HERDR_PANE_ID:'p',HERDR_WORKSPACE_ID:''},
 },
 {
  name:'skips the record when a stale pane cannot be verified',
  herdr:`  "agent list") echo '{"result":{"agents":[]}}';;`,
  env:{HERDR_PANE_ID:'wW:p5',HERDR_WORKSPACE_ID:'wW'},
 },
 {
  name:'skips when pane verification fails',
  herdr:`  "agent list") echo '{"result":{"agents":[]}}';;\n  "pane list") exit 1;;`,
  env:{HERDR_PANE_ID:'p',HERDR_WORKSPACE_ID:'w'},
 },
]
export const skipCases=rows.map(c=>({
 name:c.name,
 run:()=>base(dir=>{
  const r=spawn(dir,c.env,c.herdr)
  assert.equal(r.status,0)
  assert.equal(recordCount(dir),0)
 }),
}))
