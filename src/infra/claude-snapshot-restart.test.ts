import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

test('a new process restores a disk success during 429', () => {
  const dir = mkdtempSync(join(tmpdir(), 'claude-stale-'))
  const run = (code: string) => spawnSync(process.execPath,
    ['--import', 'tsx', '--input-type=module', '-e', code], {
      encoding: 'utf8', env: { ...process.env, BISEO_CLAUDE_SNAPSHOT_PATH: join(dir, 'usage.json') },
    })
  try {
    for (const file of ['claude-snapshot-save', 'claude-snapshot-load']) {
      const r = run(`import './src/infra/test-util/${file}.test-util.ts'`)
      assert.equal(r.status, 0, r.stderr)
    }
  } finally { rmSync(dir, { recursive: true, force: true }) }
})
