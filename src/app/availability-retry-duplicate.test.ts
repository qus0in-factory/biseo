import test from 'node:test'
import assert from 'node:assert/strict'
import { hasRetry, retryAt } from './availability-retry.js'
import { soon, wait } from './availability-retry-fixture.js'

test('duplicate scheduling dispatches only once', async () => {
  let runs = 0
  const a = soon(20)
  retryAt('p2', a, () => runs++)
  retryAt('p2', a, () => runs++)
  await wait(300)
  assert.equal(runs, 1)
  assert.equal(hasRetry('p2'), false)
})
