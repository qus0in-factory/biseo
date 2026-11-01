import assert from 'node:assert/strict'
import test from 'node:test'
import type { WorkspaceApiPort } from './ports.js'
import { createRecoveryHandlers } from './recoveryHandlers.js'

test('a recovered stream notifies the stale health error to recheck', () => {
  let recovered = 0
  const noop = () => {}
  const handlers = createRecoveryHandlers(
    {} as WorkspaceApiPort,
    noop,
    () => [],
    () => noop,
    noop,
    noop,
    noop,
    undefined,
    () => recovered++,
  )
  handlers.onOpen()
  assert.equal(recovered, 1)
})
