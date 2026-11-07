import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const load = createRequire(import.meta.url)('../scripts/protected-env.cjs')

test('protected env parses quotes, comments, equals and empty values', () => {
  const dir = mkdtempSync(join(tmpdir(), 'biseo-env-'))
  try {
    const file = join(dir, 'test.env')
    writeFileSync(file, '# comment\nA="a=b # c"\nB=\nC=plain # comment\n', { mode: 0o600 })
    assert.deepEqual(load({ BISEO_ENV_FILE: file }), { A: 'a=b # c', B: '', C: 'plain' })
    assert.deepEqual(load({ BISEO_ENV_FILE: join(dir, 'absent') }), {})
    assert.deepEqual(load({ XDG_CONFIG_HOME: dir }), {})
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
