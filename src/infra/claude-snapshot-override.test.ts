import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { claudeSnapshotPath } from './claude-snapshot-path.js'
import { holdEnv } from './test-util/hold-env.test-util.js'

test('json and env snapshot paths beat the default', () => {
 const restore = holdEnv(['BISEO_CLAUDE_SNAPSHOT_PATH', 'BISEO_STATE_DIR'])
 delete process.env.BISEO_CLAUDE_SNAPSHOT_PATH
 delete process.env.BISEO_STATE_DIR
 const cfg = join(mkdtempSync(join(tmpdir(), 'ov-')), 'c.json')
 writeFileSync(cfg, '{}')
 try {
  assert.equal(claudeSnapshotPath(cfg), resolve('data', 'claude-usage.json'))
  writeFileSync(cfg, '{"snapshotPath":"data/u.json"}')
  assert.equal(claudeSnapshotPath(cfg), resolve('data/u.json'))
  process.env.BISEO_CLAUDE_SNAPSHOT_PATH = join(tmpdir(), 'env.json')
  assert.equal(claudeSnapshotPath(cfg), resolve(process.env.BISEO_CLAUDE_SNAPSHOT_PATH))
 } finally { restore() }
})
