import assert from 'node:assert/strict'
import test from 'node:test'
import { modelDisplay } from './pane-model-line.js'
import { parseModelDisplay } from './pane-model-parse.js'

test('claude code footer uses the model name resource', () => {
  assert.equal(modelDisplay(['⏵⏵ auto mode on', 'Opus 5.5'], 'claude'), 'Opus 5.5')
  assert.equal(modelDisplay(['⏵⏵ auto mode on'], 'claude'), null)
  assert.deepEqual(parseModelDisplay('Opus 5.5', 'claude'), { modelId: 'opus-5.5', provider: 'claude' })
})
