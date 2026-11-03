import test from 'node:test'
import assert from 'node:assert/strict'
import { mergeTurn } from './mergeTurn.js'
import type { TimelineItem as T } from './timeline.js'
import type { TimelineItem } from './timeline.js'

const mk=(s:T['status'],r:string|null=null,c:string|null=null):T=>
 ({requestId:'r1',workspaceId:'w1',paneId:'p1',targetName:'t',promptText:'p',status:s,responseText:r,completedAt:c,createdAt:'2026-01-01'})
test('mergeTurn timeout upgrades and terminal states reject regressions', ()=>{
 for(const st of ['completed','blocked','failed','capture_unavailable'] as const){
  assert.equal(mergeTurn([mk('timeout')],mk(st,'ans'))[0].status,st)
 }
 assert.equal(mergeTurn([mk('completed','ans')],mk('blocked'))[0].status,'completed')
})
test('mergeTurn duplicate preserves non-empty fields idempotently', ()=>{
 const cur=mk('completed','orig','2026-01-01T12:00:00Z')
 const res=mergeTurn([cur],mk('completed',null,null))
 assert.equal(res[0].responseText,'orig')
 assert.equal(res[0].completedAt,'2026-01-01T12:00:00Z')
})
test('mergeTurn updates existing turn or appends new', () => {
  const init: TimelineItem[] = [
    {
      requestId: 'r1',
      workspaceId: 'w1',
      paneId: 'p1',
      targetName: 'T1',
      promptText: 'hi',
      status: 'queued',
      createdAt: '2026-10-28T00:00:00Z',
    },
  ]
  const updated: TimelineItem = {
    ...init[0],
    status: 'completed',
    responseText: 'done text',
  }
  const r1 = mergeTurn(init, updated)
  assert.equal(r1.length, 1)
  assert.equal(r1[0].status, 'completed')
  assert.equal(r1[0].responseText, 'done text')
})
function itm(status: TimelineItem['status'], resp: string | null = null): TimelineItem {
  return {
    requestId: 'r1',
    workspaceId: 'w1',
    paneId: 'p1',
    targetName: 'T1',
    promptText: 'hi',
    status,
    responseText: resp,
    createdAt: '2026-10-28T00:00:00Z',
  }
}

test('mergeTurn prevents regressions', () => {
  const res = mergeTurn([itm('completed', 'done')], itm('queued'))
  assert.equal(res[0].status, 'completed')
  assert.equal(res[0].responseText, 'done')
})
function errorItem(s: TimelineItem['status'], err: string | null = null): TimelineItem {
  return {
    requestId: 'r1',
    workspaceId: 'w1',
    paneId: 'p1',
    targetName: 'T1',
    promptText: 'hi',
    status: s,
    errorCode: err,
    createdAt: '2026-10-28T00:00:00Z',
  }
}

test('recovers uncertain delivery and clears its error', () => {
  const cur = [errorItem('failed', 'delivery_uncertain')]
  assert.equal(mergeTurn(cur, errorItem('queued'))[0].status, 'queued')
  assert.equal(mergeTurn(cur, errorItem('working'))[0].status, 'working')
  const done = mergeTurn(cur, errorItem('completed'))[0]
  assert.equal(done.status, 'completed')
  assert.equal(done.errorCode, null)

  const other = [errorItem('failed', 'network_error')]
  assert.equal(mergeTurn(other, errorItem('working'))[0].status, 'failed')
  assert.equal(mergeTurn(other, errorItem('completed'))[0].status, 'failed')
})

test('mergeTurn handles late completed update', () => {
  const late = mergeTurn([itm('timeout')], itm('completed', 'ok'))
  assert.equal(late[0].status, 'completed')

  const noReg = mergeTurn([itm('completed', 'ok')], itm('timeout'))
  assert.equal(noReg[0].status, 'completed')
})

test('mergeTurn handles cancel from queued', () => {
  const cancel = mergeTurn([itm('queued')], itm('cancelled'))
  assert.equal(cancel[0].status, 'cancelled')
})
