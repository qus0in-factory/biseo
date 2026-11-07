import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { claudeSnapshotPath } from './claude-snapshot-path.js'
import { holdEnv } from './test-util/hold-env.test-util.js'

test('unreadable snapshot config warns once and keeps the default', () => {
 const restore = holdEnv(['BISEO_CLAUDE_SNAPSHOT_PATH', 'BISEO_STATE_DIR'])
 delete process.env.BISEO_CLAUDE_SNAPSHOT_PATH
 const dir = mkdtempSync(join(tmpdir(), 'csp-bad-'))
 process.env.BISEO_STATE_DIR = join(dir, 'state')
 const cfg = join(dir, 'c.json')
 writeFileSync(cfg, '{')
 const seen: string[] = []
 try {
  const want = join(dir, 'state', 'claude-usage.json')
  assert.equal(claudeSnapshotPath(cfg, r => seen.push(r)), want)
  assert.equal(claudeSnapshotPath(cfg, r => seen.push(r)), want)
  assert.deepEqual(seen, ['config_unreadable'])
 } finally { restore() }
})
