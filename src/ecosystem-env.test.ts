import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

test('ecosystem puts protected file values in PM2 env', () => {
  const dir = mkdtempSync(join(tmpdir(), 'eco-env-'))
  try {
    const file = join(dir, 'test.env')
    writeFileSync(file, 'SERVICE_ISSUER=test-issuer\n', { mode: 0o600 })
    const result = spawnSync(process.execPath, ['-e',
      "const a=require('./ecosystem.config.cjs').apps[0];process.exit(a.env.SERVICE_ISSUER==='test-issuer'?0:1)"],
    { env: { ...process.env, BISEO_ENV_FILE: file }, encoding: 'utf8' })
    assert.equal(result.status, 0)
    assert.equal(result.stdout + result.stderr, '')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
