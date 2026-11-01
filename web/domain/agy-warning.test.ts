import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluatePaneUsageWarning as evaluate } from './pane-usage-warning'
import { makeTestPane } from './pane-usage-test-helper'
import { agyWarningFixture } from './agy-warning-fixture'
test('Gemini ignores exhausted Claude and Argon pools; own threshold warns', () => {
 const pane = {...makeTestPane('agy', 'gf'), modelId: 'gemini-3-pro'}
 assert.equal(evaluate(pane, [agyWarningFixture(10)]).hasWarning, false)
 assert.equal(evaluate(pane, [agyWarningFixture(95)]).hasWarning, true)
})
test('unknown models never infer a family from aliases or runtime names', () => {
 for (const modelId of [null, '', 'other-model']) {
  const pane = {...makeTestPane('agy', 'Gemini'), modelId}
  assert.equal(evaluate(pane, [agyWarningFixture(100)]).hasWarning, false)
 }
})
