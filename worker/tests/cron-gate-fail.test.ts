import assert from 'node:assert/strict'
import test from 'node:test'
import { logCronTick } from '../infra/cron-tick-log.js'
import { syncSteps } from '../scheduled-sync.js'
test('prepare throw is an error tick and skips sync', async () => {
 const logs:string[]=[],orig=console.log
 console.log=(...a:unknown[])=>{logs.push(String(a[0]))}
 const steps:any[]=[{component:'herdr-config',status:'ok',durationMs:1},{component:'queue-tick',status:'ok',durationMs:1}]
 const db={prepare(){throw new Error('d1')}}
 try{await syncSteps(db,{},'ws',steps);logCronTick(steps,{rowsRead:0,rowsWritten:0},1,'req')}
 finally{console.log=orig}
 const tick=JSON.parse(logs.find(s=>s.includes('worker.cron.tick'))!)
 assert.equal(tick.level,'error')
 assert.equal(tick.steps.find((s:any)=>s.component==='sync-gate').status,'fail')
 for(const name of['turn-reconcile','usage-sync']){
  const step=tick.steps.find((s:any)=>s.component===name)
  assert.equal(step.status,'skipped')
  assert.equal(step.code,'not_run')
 }
})
