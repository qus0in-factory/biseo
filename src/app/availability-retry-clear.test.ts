import test from 'node:test'
import assert from 'node:assert/strict'
import { clearRetry, hasRetry, retryAt } from './availability-retry.js'
import { soon, wait } from './availability-retry-fixture.js'

test('one retry timer per pane and clear cancels it', async () => {
  let runs = 0
  const a = soon(20)
  retryAt('p1', a, () => runs++)
  retryAt('p1', a, () => runs++)
  assert.equal(hasRetry('p1'), true)
  clearRetry('p1')
  assert.equal(hasRetry('p1'), false)
  await wait(250)
  assert.equal(runs, 0)
})
