import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

// Bounded child process: an unterminated block comment must fail fast, never spin (sol P1-2).
test('parseJsonc exits with a syntax error instead of looping on unterminated comment', () => {
  const code = "import('./src/infra/jsonc.ts').then(m => m.parseJsonc('{/* unterminated'))"
  const r = spawnSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', code],
    { encoding: 'utf8', timeout: 10_000 })
  assert.equal(r.error, undefined, 'child did not finish within the time limit')
  assert.equal(r.status, 1)
  assert.match(r.stderr, /unterminated block comment/)
})
