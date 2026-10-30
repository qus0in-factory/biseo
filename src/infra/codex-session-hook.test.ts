import test from 'node:test'
import assert from 'node:assert/strict'
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { run, file } from './codex-session-hook-run-fixture.js'
import { fakeHerdr } from './codex-session-hook-herdr-fixture.js'
import { checkWrite } from './codex-session-hook-write-check-fixture.js'

const input = JSON.stringify({ session_id: 's1', transcript_path: '/home/test/.codex/sessions/a.jsonl' })
const base = (fn: (dir: string) => void) => {
  const dir = mkdtempSync(join(tmpdir(), 'biseo-hook-'))
  try {
    fn(dir)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}
const recordCount = (dir: string) =>
  existsSync(join(dir, 'codex')) ? readdirSync(join(dir, 'codex')).length : 0

const skipCases = [
  {
    name: 'skips when the workspace is missing',
    herdr: `  "agent list") echo '{"result":{"agents":[]}}';;\n  "pane list") echo '{"result":{"panes":[{"pane_id":"p"}]}}';;`,
    env: { HERDR_PANE_ID: 'p', HERDR_WORKSPACE_ID: '' },
  },
  {
    name: 'skips the record when a stale pane cannot be verified',
    herdr: `  "agent list") echo '{"result":{"agents":[]}}';;`,
    env: { HERDR_PANE_ID: 'wW:p5', HERDR_WORKSPACE_ID: 'wW' },
  },
  {
    name: 'skips when pane verification fails',
    herdr: `  "agent list") echo '{"result":{"agents":[]}}';;\n  "pane list") exit 1;;`,
    env: { HERDR_PANE_ID: 'p', HERDR_WORKSPACE_ID: 'w' },
  },
]

for (const c of skipCases) {
  test(c.name, () => base((dir) => {
    const bin = fakeHerdr(dir, c.herdr)
    const r = run(dir, { ...c.env, HERDR_BIN_PATH: bin }, input)
    assert.equal(r.status, 0)
    assert.equal(recordCount(dir), 0)
  }))
}

test('keeps the env pane when herdr confirms it', () => base((dir) => {
  const bin = fakeHerdr(dir, `  "agent list") echo '{"result":{"agents":[]}}';;\n  "pane list") echo '{"result":{"panes":[{"pane_id":"p"}]}}';;`)
  const r = run(dir, { HERDR_PANE_ID: 'p', HERDR_WORKSPACE_ID: 'w', HERDR_BIN_PATH: bin }, input)
  assert.equal(r.status, 0)
  assert.equal(JSON.parse(readFileSync(file(dir, 'p'), 'utf8')).pane_id, 'p')
}))

test('uses the herdr session owner when the daemon pane is stale', () => base((dir) => {
  const bin = fakeHerdr(dir, `  "agent list") echo '{"result":{"agents":[{"pane_id":"w1T:p1","agent_session":{"value":"s1"}}]}}';;`)
  const r = run(dir, { HERDR_PANE_ID: 'wW:p5', HERDR_WORKSPACE_ID: 'wW', HERDR_BIN_PATH: bin }, input)
  assert.equal(r.status, 0)
  assert.equal(JSON.parse(readFileSync(file(dir, 'w1T:p1'), 'utf8')).pane_id, 'w1T:p1')
  assert.equal(existsSync(file(dir, 'wW:p5')), false)
}))

test('overwrites without leaving temp files', () => base((dir) => {
  const p = '/home/test/.codex/sessions/a.jsonl'
  assert.equal(run(dir, { HERDR_PANE_ID: 'p' }, JSON.stringify({ session_id: 's1', transcript_path: p })).status, 0)
  assert.equal(run(dir, { HERDR_PANE_ID: 'p' }, JSON.stringify({ session_id: 's2', transcript_path: p })).status, 0)
  assert.equal(JSON.parse(readFileSync(file(dir, 'p'), 'utf8')).session_id, 's2')
  assert.deepEqual(readdirSync(join(dir, 'codex')), ['70.json'])
}))

test('repairs an existing state directory to 0700', () => base((dir) => {
  const state = join(dir, 'codex')
  mkdirSync(state, { recursive: true })
  chmodSync(state, 0o755)
  const r = run(dir, { HERDR_PANE_ID: 'p' }, input)
  assert.equal(r.status, 0)
  assert.equal(statSync(state).mode & 0o777, 0o700)
}))

test('writes a private atomic record for the pane', () => base((dir) => {
  const rec = { session_id: 's1', transcript_path: '/home/test/.codex/sessions/2026/01/01/rollout-test.jsonl' }
  const r = run(dir, { HERDR_PANE_ID: 'w1T:p2' }, JSON.stringify(rec))
  assert.equal(r.status, 0)
  assert.equal(r.stdout, '')
  assert.equal(r.stderr, '')
  checkWrite(dir, rec)
}))

test('silently ignores missing pane or invalid input', () => {
  const cases: [Record<string, string>, string][] = [
    [{ HERDR_PANE_ID: '' }, JSON.stringify({ session_id: 's1', transcript_path: '/x' })],
    [{ HERDR_PANE_ID: 'p' }, '{bad'],
    [{ HERDR_PANE_ID: 'p' }, JSON.stringify({ session_id: 's1', transcript_path: 'relative' })],
    [{ HERDR_PANE_ID: 'p' }, JSON.stringify({ session_id: '../x', transcript_path: '/x' })],
  ]
  for (const [env, body] of cases) {
    base((dir) => {
      const r = run(dir, env, body)
      assert.equal(r.status, 0)
      assert.equal(r.stdout, '')
      assert.equal(r.stderr, '')
      assert.equal(recordCount(dir), 0)
    })
  }
})
