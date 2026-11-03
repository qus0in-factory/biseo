import test from 'node:test'
import assert from 'node:assert/strict'
import { queueFixture } from '../test-util/queue-fixture.js'
import { applyResult } from '../app/timeline-apply.js'
import { findTurn } from '../infra/d1-timeline-find.js'
test('blocked input reason survives existing Worker storage contract', async () => {
  const { db, put } = await queueFixture()
  await put('r')
  await applyResult(db, 'r', { status: 'blocked', errorCode: 'input_request' })
  const r = await findTurn(db, { workspaceId: 'w', ownerSubject: 'o' }, 'r')
  assert.equal(r?.status, 'blocked')
  assert.equal(r?.errorCode, 'input_request')
})
