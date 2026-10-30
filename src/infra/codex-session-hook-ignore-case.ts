import assert from'node:assert/strict'
import{base,recordCount}from'./codex-session-hook-fixture.js'
import{run}from'./codex-session-hook-run-fixture.js'
export const ignoreCase={
 name:'silently ignores missing pane or invalid input',
 run:()=>{
  const cases:[Record<string,string>,string][]=[
   [{HERDR_PANE_ID:''},JSON.stringify({session_id:'s1',transcript_path:'/x'})],
   [{HERDR_PANE_ID:'p'},'{bad'],
   [{HERDR_PANE_ID:'p'},JSON.stringify({session_id:'s1',transcript_path:'relative'})],
   [{HERDR_PANE_ID:'p'},JSON.stringify({session_id:'../x',transcript_path:'/x'})],
  ]
  for(const[env,body]of cases)base(dir=>{
   const r=run(dir,env,body)
   assert.equal(r.status,0)
   assert.equal(r.stdout,'')
   assert.equal(r.stderr,'')
   assert.equal(recordCount(dir),0)
  })
 },
}
