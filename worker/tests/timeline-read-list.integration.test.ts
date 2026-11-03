import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../index.js';
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js';
import { getList } from '../test-util/d1-requests.js';
import { workingRow } from '../test-util/queue-working-fixture.js';
import { completed } from '../test-util/d1-completed.js';
import { add, body, makeEnv, page } from '../test-util/timeline-page-fixture.js';

test('timeline GET reconciles a completed result after a disconnect', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json(completed)) as any
  try {
    await workingRow(env.BISEO_DB!)
    const j: any = await (await app.fetch(getList(cookie), env)).json()
    assert.equal(j.items[0].status, 'completed')
    assert.equal(j.items[0].responseText, 'done')
  } finally { globalThis.fetch = orig }
})

test('before cursor continues older and stops at the end',async()=>{
 const{env,cookie}=await makeEnv()
 for(const id of['r1','r2','r3','r4','r5'])await add(env,id,'w1T:p1')
 const first=await body(await page(env,cookie,'paneId=w1T:p1&limit=3'))
 const next=await body(await page(env,cookie,`paneId=w1T:p1&limit=3&before=${first.nextBefore}`))
 assert.deepEqual(next.items.map(i=>i.requestId),['r2','r1'])
 assert.equal(next.hasMore,false)
 assert.equal(next.nextBefore,null)
 const end=await body(await page(env,cookie,`paneId=w1T:p1&limit=3&before=${next.items[1].seq}`))
 assert.deepEqual(end.items,[])
 assert.equal(end.hasMore,false)
})

test('pane, owner and workspace scope are enforced', async () => {
  const { env, cookie } = await makeEnv()
  await add(env, 'own', 'w1T:p1')
  await add(env, 'otherPane', 'w1T:p2')
  await add(env, 'otherOwner', 'w1T:p1', 'someone')
  await add(env, 'otherWs', 'w1T:p1', 'owner', 'w2')
  const b = await body(await page(env, cookie, 'paneId=w1T:p1&limit=3'))
  assert.deepEqual(b.items.map((i) => i.requestId), ['own'])
})

test('initial page returns only the pane latest three with a cursor',async()=>{
 const{env,cookie}=await makeEnv()
 for(const id of['r1','r2','r3','r4','r5'])await add(env,id,'w1T:p1')
 await add(env,'x1','w1T:p2')
 const b=await body(await page(env,cookie,'paneId=w1T:p1&limit=3'))
 assert.deepEqual(b.items.map(i=>i.requestId),['r5','r4','r3'])
 assert.equal(b.hasMore,true)
 assert.equal(b.nextBefore,b.items[2].seq)
})
