import test from 'node:test'
import assert from 'node:assert/strict'
import { paneBlocked } from './pane-blocked.js'
import { unknownAvailability } from '../domain/availability.js'
const at='2026-10-29T11:00:00.000Z'
const limited={...unknownAvailability(new Date('2026-10-29T10:00:00.000Z')),state:'limited'as const,source:'codex',resetsAt:at,reason:'rate_limit_reached',window:'primary'as const}
test('blocked reason prioritizes usage limits and markers',()=>{
 assert.equal(paneBlocked({status:'blocked'},limited,false),'usage_limit')
 assert.equal(paneBlocked({status:'idle'},limited,true),'usage_limit')
 assert.equal(paneBlocked({status:'blocked'},unknownAvailability(),true),'usage_limit')
 assert.equal(paneBlocked({status:'blocked'},unknownAvailability(),false),'unknown')
 assert.equal(paneBlocked({status:'blocked'},unknownAvailability(),false,true),'input_request')
 assert.equal(paneBlocked({status:'idle'},unknownAvailability(),true),null)
})
