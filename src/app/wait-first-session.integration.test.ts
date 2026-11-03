import test from'node:test'
import assert from'node:assert/strict'
import{waitFirstSession}from'./wait-first-session.js'
import { mk, mkSub, tick } from './wait-first-session-fixture.js'
import { mk, mkSub, ses, tick } from './wait-first-session-fixture.js'
import type { EventSub } from './first-session-snap.js'
import { mk, ses } from './wait-first-session-fixture.js'

{
const ses={source:'herdr:opencode',agent:'opencode',kind:'id' as const,value:'ses_7'}
const tick=(n=10)=>new Promise(r=>setTimeout(r,n))
test('event before ack unsubs once, duplicates add no reads',async()=>{
 let cur:unknown,n=0,un=0,ev!:(e:string)=>void,go!:()=>void
 const h={getPane:async()=>{n++;return{pane_id:'w:p1',terminal_id:'term',agent:'opencode',agent_session:cur,revision:1}},getAgent:async()=>undefined}as never
 const sub=async(_:string[],e:(x:string)=>void)=>{ev=e;return new Promise<()=>void>(r=>{go=()=>r(()=>{un++})})}
 const p=waitFirstSession(h,'w:p1','term',500,()=>false,sub)
 await tick()
 assert.equal(n,1)
 cur=ses
 ev('agent_status')
 assert.deepEqual(await p,ses)
 assert.equal(un,0)
 go()
 await tick()
 assert.equal(un,1)
 const m=n
 ev('agent_status')
 await tick(20)
 assert.equal(n,m)
 assert.equal(un,1)
})
}
{

test('pre-start cancel never subscribes; socket close ends wait', async () => {
  const { h } = mk(() => undefined)
  const { sub, r } = mkSub()
  assert.equal(await waitFirstSession(h, 'w:p1', 'term', 50, () => true, sub), null)
  assert.equal(r.ids.length, 0)
  const { h: h2 } = mk(() => undefined)
  const { sub: s2, r: r2 } = mkSub()
  const p = waitFirstSession(h2, 'w:p1', 'term', 500, () => false, s2)
  await tick()
  r2.cl.forEach((f) => f())
  assert.equal(await p, null)
  assert.equal(r2.un, 1)
})
}
{

test('event resolves session with bounded reads and unsubscribes', async () => {
  let cur: unknown
  const { h, reads } = mk(() => cur)
  const { sub, r } = mkSub()
  const p = waitFirstSession(h, 'w:p1', 'term', 500, () => false, sub)
  await tick()
  assert.equal(reads(), 2)
  assert.deepEqual(r.ids, [['w:p1']])
  cur = ses
  r.ev.forEach((f) => f('agent_status'))
  assert.deepEqual(await p, ses)
  assert.equal(r.un, 1)
  const n = reads()
  r.ev.forEach((f) => f('agent_status'))
  await tick()
  assert.equal(reads(), n)
})
}
{
const tick=(n=10)=>new Promise(r=>setTimeout(r,n))
test('late sub after timeout unsubs once',async()=>{
 const h={getPane:async()=>({pane_id:'w:p1',terminal_id:'term',agent:'opencode'}),getAgent:async()=>undefined}as never
 let un=0,go!:(u:()=>void)=>void
 const sub=async()=>new Promise<()=>void>(r=>{go=()=>r(()=>{un++})})
 const p=waitFirstSession(h,'w:p1','term',20,()=>false,sub)
 assert.equal(await p,null)
 go()
 await tick()
 assert.equal(un,1)
})
}
{

test('session reported between first read and subscribe wins without events', async () => {
  let cur: unknown
  const { h } = mk(() => cur)
  let fired = 0
  const sub: EventSub = async () => { cur = ses; return () => { fired++ } }
  assert.deepEqual(await waitFirstSession(h, 'w:p1', 'term', 200, () => false, sub), ses)
  assert.equal(fired, 1)
})
}
