import test from 'node:test'
import assert from 'node:assert/strict'
import { inputStatus } from './inputStatus'

test('only blocked input requests need input; other states keep their meaning', () => {
  assert.equal(inputStatus('blocked', 'input_request'), 'input_required')
  for (const reason of ['usage_limit', 'unknown', null, undefined] as const)
    assert.equal(inputStatus('blocked', reason), 'blocked')
  for (const status of ['idle', 'working', 'done', 'unknown'] as const)
    assert.equal(inputStatus(status, 'input_request'), status)
})
