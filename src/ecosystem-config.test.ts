import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('ecosystem without protected env preserves process name fallback', () => {
  const dir = mkdtempSync(join(tmpdir(), 'eco-'))
  try {
    for (const value of [undefined, 'test-process', '']) {
      const env = { ...process.env, BISEO_ENV_FILE: join(dir, 'absent') }
      delete env.PROCESS_NAME
      if (value !== undefined) env.PROCESS_NAME = value
      const result = spawnSync(process.execPath, ['-p',
        `require(${JSON.stringify(resolve('ecosystem.config.cjs'))}).apps[0].name`],
      { env, encoding: 'utf8' })
      assert.equal(result.status, 0)
      assert.equal(result.stdout.trim(), value ?? 'biseo')
    }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
