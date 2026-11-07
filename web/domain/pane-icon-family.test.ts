import assert from 'node:assert/strict'
import test from 'node:test'
import { paneIconFamily } from './pane-icon-family.js'

test('pane icons come from the icon resource', () => {
  assert.equal(paneIconFamily('grok-4.7', 'grok'), 'xai')
  assert.equal(paneIconFamily('muse-spark-1.3-contributor', 'opencode-go'), 'meta')
  assert.equal(paneIconFamily('opus-5.5', 'claude'), 'claude')
})
