import assert from 'node:assert/strict'
import test from 'node:test'
import { parseModelDisplay } from './pane-model-parse.js'
import { modelDisplay } from './pane-model-line.js'

test('grok status suffix comes from the suffix resource', () => {
  assert.deepEqual(parseModelDisplay('Grok 4.7 xAI', 'opencode'), { modelId: 'grok-4.7', provider: 'grok' })
  const line = '┃  Build auto · Grok 4.7 xAI · low'
  assert.equal(modelDisplay([line], 'opencode'), 'Grok 4.7 xAI')
})
