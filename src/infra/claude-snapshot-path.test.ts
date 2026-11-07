import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { claudeSnapshotPath } from './claude-snapshot-path.js'
import { holdEnv } from './test-util/hold-env.test-util.js'

test('missing snapshot key uses state dir and does not warn', () => {
 const restore = holdEnv(['BISEO_CLAUDE_SNAPSHOT_PATH', 'BISEO_STATE_DIR'])
 delete process.env.BISEO_CLAUDE_SNAPSHOT_PATH
 const dir = mkdtempSync(join(tmpdir(), 'csp-'))
 const cfg = join(dir, 'c.json')
 writeFileSync(cfg, '{}')
 process.env.BISEO_STATE_DIR = join(dir, 'state')
 const seen: string[] = []
 try {
  const want = join(dir, 'state', 'claude-usage.json')
  assert.equal(claudeSnapshotPath(join(dir, 'none.json'), r => seen.push(r)), want)
  assert.equal(claudeSnapshotPath(cfg, r => seen.push(r)), want)
  assert.deepEqual(seen, [])
 } finally { restore() }
})
