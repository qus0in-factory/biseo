import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { claudeBackoffCfg, CLAUDE_BACKOFF_DEFAULT } from './claude-oauth-config.js'

const file = (body: string) => {
  const p = join(mkdtempSync(join(tmpdir(), 'cc-')), 'c.json')
  writeFileSync(p, body)
  return p
}

test('claude backoff cfg falls back to defaults when file is missing or broken', () => {
  assert.deepEqual(claudeBackoffCfg('/nonexistent/claude-oauth.json'), CLAUDE_BACKOFF_DEFAULT)
  assert.deepEqual(claudeBackoffCfg(file('{oops')), CLAUDE_BACKOFF_DEFAULT)
  assert.deepEqual(claudeBackoffCfg(file('null')), CLAUDE_BACKOFF_DEFAULT)
})

test('claude backoff cfg replaces invalid numbers per field', () => {
  const c = claudeBackoffCfg(file('{"initialMs":"x","maxMs":-1,"factor":0}'))
  assert.deepEqual(c, CLAUDE_BACKOFF_DEFAULT)
  const k = claudeBackoffCfg(file('{"initialMs":5000,"maxMs":1000,"factor":3}'))
  assert.deepEqual(k, { initialMs: 5000, maxMs: 5000, factor: 3 })
})
