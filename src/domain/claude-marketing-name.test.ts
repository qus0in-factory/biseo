import assert from 'node:assert/strict'
import test from 'node:test'
import { claudeMarketingName } from './claude-marketing-name.js'
const model = '{"attachment":{"type":"model","identity":{"marketingName":"Opus 5.5"}}}\n'
test('only a model attachment marketing name is used', () => {
  const canary = '{"type":"user","message":{"marketingName":"SECRET-CANARY-DO-NOT-DISPLAY"}}\n'
  const spaced = '{ "attachment" : { "type" : "model", "identity" : { "marketingName" : "Opus 5.5" } } }\n'
  assert.equal(claudeMarketingName(canary + model), 'Opus 5.5')
  assert.equal(claudeMarketingName(spaced), 'Opus 5.5')
  assert.equal(claudeMarketingName(canary), null)
})
