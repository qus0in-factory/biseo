import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { claudeBackoffCfg as cfg, CLAUDE_BACKOFF_DEFAULT as D } from './claude-oauth-config.js'

const f = (body: string) => {
  const p = join(mkdtempSync(join(tmpdir(), 'cc-')), 'c.json')
  return writeFileSync(p, body), p
}

test('claude backoff cfg falls back to defaults when file is missing or broken', () => {
  for (const p of ['/nonexistent/c.json', f('{oops'), f('null')]) assert.deepEqual(cfg(p), D)
})

test('claude backoff cfg replaces invalid numbers per field', () => {
  assert.deepEqual(cfg(f('{"initialMs":"x","maxMs":-1,"factor":0}')), D)
  assert.deepEqual(cfg(f('{"initialMs":5000,"maxMs":1000,"factor":3}')), { initialMs: 5000, maxMs: 5000, factor: 3 })
})
