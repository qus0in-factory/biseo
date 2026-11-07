import assert from 'node:assert/strict'
import { copyFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('ecosystem without runtime.json', () => {
  const dir = mkdtempSync(join(tmpdir(), 'eco-'))
  try {
    copyFileSync('ecosystem.config.cjs', join(dir, 'ecosystem.config.cjs'))
    copyFileSync('package.json', join(dir, 'package.json'))
    for (const value of [undefined, 'test-process', '']) {
      const env = { ...process.env }
      delete env.PROCESS_NAME
      if (value !== undefined) env.PROCESS_NAME = value
      const result = spawnSync(process.execPath, ['-p',
        `require(${JSON.stringify(join(dir, 'ecosystem.config.cjs'))}).apps[0].name`],
      { env, encoding: 'utf8' })
      assert.equal(result.status, 0)
      assert.equal(result.stdout.trim(), value ?? 'biseo')
    }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
