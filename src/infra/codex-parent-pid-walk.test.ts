import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { run } from './codex-parent-pid-fixture.js'

test('walks parent pids to the nearest codex process', () => {
 const base = mkdtempSync(join(tmpdir(), 'biseo-parent-'))
 try {
  const r = run(base, ' comm=:111) echo sh;; ppid=:111) echo 222;; comm=:222) echo codex;;', '111')
  assert.equal(r.status, 0)
  assert.equal(r.stdout.trim(), '222')
 } finally {
  rmSync(base, { recursive: true, force: true })
 }
})