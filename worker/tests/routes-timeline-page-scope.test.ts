import assert from 'node:assert/strict'
import test from 'node:test'
import { add, body, makeEnv, page } from './timeline-page-fixture.js'

test('pane, owner and workspace scope are enforced', async () => {
  const { env, cookie } = await makeEnv()
  await add(env, 'own', 'w1T:p1')
  await add(env, 'otherPane', 'w1T:p2')
  await add(env, 'otherOwner', 'w1T:p1', 'someone')
  await add(env, 'otherWs', 'w1T:p1', 'owner', 'w2')
  const b = await body(await page(env, cookie, 'paneId=w1T:p1&limit=3'))
  assert.deepEqual(b.items.map((i) => i.requestId), ['own'])
})
