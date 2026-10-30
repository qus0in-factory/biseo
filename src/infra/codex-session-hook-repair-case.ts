import assert from'node:assert/strict'
import{chmodSync,mkdirSync,statSync}from'node:fs'
import{join}from'node:path'
import{base,spawn}from'./codex-session-hook-fixture.js'
export const repairCase={
 name:'repairs an existing state directory to 0700',
 run:()=>base(dir=>{
  const state=join(dir,'codex')
  mkdirSync(state,{recursive:true})
  chmodSync(state,0o755)
  const r=spawn(dir,{HERDR_PANE_ID:'p'})
  assert.equal(r.status,0)
  assert.equal(statSync(state).mode&0o777,0o700)
 }),
}
