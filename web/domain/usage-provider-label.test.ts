import assert from 'node:assert/strict'
import test from 'node:test'
import { usageProviderLabel } from './usage-provider-label.js'

test('xai and grok use the resource display name', () => {
  assert.equal(usageProviderLabel('xai'), 'Grok')
  assert.equal(usageProviderLabel('grok'), 'Grok')
  assert.equal(usageProviderLabel('claude'), 'claude')
})
