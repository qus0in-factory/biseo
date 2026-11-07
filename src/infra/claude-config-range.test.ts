import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { claudeBackoffCfg, CLAUDE_BACKOFF_DEFAULT } from './claude-oauth-config.js'

test('config rejects numbers above the Date limit', () => {
  const dir = mkdtempSync(join(tmpdir(), 'claude-range-'))
  try {
    const path = join(dir, 'config.json')
    writeFileSync(path, JSON.stringify({ initialMs: 1e17, maxMs: 1e17, factor: 1e17 }))
    assert.deepEqual(claudeBackoffCfg(path), CLAUDE_BACKOFF_DEFAULT)
  } finally {
    rmSync(dir, { recursive: true })
  }
})
