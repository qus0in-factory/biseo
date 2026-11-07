import test from 'node:test'
import assert from 'node:assert/strict'
import { hasVersionMark } from '../scripts/release-version-mark.mjs'

const P = 'app-version:'

test('accepts bundle carrying the app version mark', () => {
  assert.equal(hasVersionMark(`x({"data-app-version":"${P}0.6.0"})`, P, '0.6.0'), true)
})

test('rejects old app bundle that only contains another 0.6.0 string', () => {
  const js = `const a="${P}0.5.4";const dep="0.6.0";`
  assert.equal(hasVersionMark(js, P, '0.6.0'), false)
})

test('rejects partial version match', () => {
  assert.equal(hasVersionMark(`"${P}0.6.01"`, P, '0.6.0'), false)
})
