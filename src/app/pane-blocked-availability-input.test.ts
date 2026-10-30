import test from 'node:test'
import assert from 'node:assert/strict'
import { availabilitySummaries } from './pane-availability.js'
import { PaneLocks } from './pane-locks.js'
import { agent, pane } from './turn-data-fixture.js'
test('blocked input markers classify as input_request', async () => {
 const blocked={...agent,agent_status:'blocked' as const}
 const base=[{...pane,agent_status:'blocked' as const}]
 const s=await availabilitySummaries(base,[blocked],new PaneLocks(),undefined,new Date(),undefined,{classify:async()=>true})
 assert.equal(s[0].blockedReason,'input_request')
 assert.equal(s[0].disabledReason,'agent_blocked')
})
