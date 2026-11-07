import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { claudeSnapshotPath } from './claude-snapshot-path.js'

const env = process.env
const prev = env.BISEO_CLAUDE_SNAPSHOT_PATH
delete env.BISEO_CLAUDE_SNAPSHOT_PATH
test.after(() => { if (prev) env.BISEO_CLAUDE_SNAPSHOT_PATH = prev })

test('missing snapshot path warns once instead of silently going non-persistent', () => {
  const dir = mkdtempSync(join(tmpdir(), 'csp-'))
  const cfg = join(dir, 'c.json')
  writeFileSync(cfg, '{}')
  const seen: string[] = []
  const warn = (r: string) => { seen.push(r) }
  assert.equal(claudeSnapshotPath(join(dir, 'none.json'), warn), null)
  assert.equal(claudeSnapshotPath(cfg, warn), null)
  assert.deepEqual(seen, ['config_unreadable'])
  writeFileSync(cfg, '{"snapshotPath":"data/u.json"}')
  assert.equal(claudeSnapshotPath(cfg, warn), resolve('data/u.json'))
})
