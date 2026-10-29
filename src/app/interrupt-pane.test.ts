import test from 'node:test'
import assert from 'node:assert/strict'
import { interruptPane } from './interrupt-pane.js'
import { makeDeps } from './turn-fixture.test.js'
import { pane, reader } from './turn-fixture-data.test.js'
import type { AuditLog } from './interrupt-audit.js'

const allow = { default: ['esc'], opencode: ['esc'], claude: ['esc', 'ctrl+c'] }
const limited = {
  state: 'limited' as const,
  source: 'codex',
  checkedAt: '2026-10-29T10:00:00.000Z',
  resetsAt: new Date(Date.now() + 60000).toISOString(),
  reason: 'rate_limit_reached',
  window: 'primary' as const,
}

function setup(overrides: { agent?: string; workspace?: string; send?: () => Promise<void> } = {}) {
  const d = makeDeps(reader)
  const logs: Record<string, unknown>[] = []
  const audit: AuditLog = { info: (o) => logs.push(o), msg: () => {} } as AuditLog
  d.herdr.getPane = async () => ({
    ...pane,
    agent: overrides.agent ?? 'claude',
    workspace_id: overrides.workspace ?? 'w',
  })
  d.herdr.sendKeys = overrides.send ?? (async () => {})
  const deps = { ...d, interruptAllowlist: allow, audit }
  return { deps, logs }
}

test('default Esc interrupt is sent once and audited', async () => {
  let sent: [string, string] | null = null
  const { deps, logs } = setup({ send: async (id, key) => { sent = [id, key] } })
  const r = await interruptPane(deps, 'w:p1', 'esc')
  assert.equal(r.status, 200)
  assert.deepEqual(r.body, { paneId: 'w:p1', key: 'esc', status: 'sent' })
  assert.deepEqual(sent, ['w:p1', 'esc'])
  assert.deepEqual(logs, [{ paneId: 'w:p1', key: 'esc', result: 'sent' }])
})

test('opencode Ctrl+C is rejected and never sent', async () => {
  let sent = false
  const { deps, logs } = setup({ agent: 'opencode', send: async () => { sent = true } })
  const r = await interruptPane(deps, 'w:p1', 'ctrl+c')
  assert.equal(r.status, 400)
  assert.equal(r.body.reason, 'key_not_allowed')
  assert.equal(sent, false)
  assert.equal(logs[0]?.result, 'denied')
})

test('usage-limited panes return 409 before interrupt', async () => {
  let sent = false
  const { deps, logs } = setup({ send: async () => { sent = true } })
  deps.availability = { get: async () => limited }
  const r = await interruptPane(deps, 'w:p1', 'esc')
  assert.equal(r.status, 409)
  assert.deepEqual(r.body, {
    error: 'target_not_ready',
    reason: 'usage_limited',
    resetsAt: limited.resetsAt,
  })
  assert.equal(sent, false)
  assert.equal(logs[0]?.result, 'limited')
})

test('expired usage limits release the interrupt instead of blocking forever', async () => {
  let sent = false
  const { deps, logs } = setup({ send: async () => { sent = true } })
  deps.availability = {
    get: async () => ({ ...limited, resetsAt: new Date(Date.now() - 1000).toISOString() }),
  }
  const r = await interruptPane(deps, 'w:p1', 'esc')
  assert.equal(r.status, 200)
  assert.equal(sent, true)
  assert.equal(logs[0]?.result, 'sent')
})

test('pane lookup is restricted to the allowed workspace and known panes', async () => {
  const { deps } = setup({ workspace: 'other' })
  const r = await interruptPane(deps, 'w:p1', 'esc')
  assert.equal(r.status, 403)
  deps.herdr.getPane = async () => undefined
  const missing = await interruptPane(deps, 'w:none', 'esc')
  assert.equal(missing.status, 404)
})

test('invalid keys and send failures are audited', async () => {
  const { deps, logs } = setup({ send: async () => Promise.reject(new Error('down')) })
  const bad = await interruptPane(deps, 'w:p1', 'return')
  assert.equal(bad.status, 400)
  const failed = await interruptPane(deps, 'w:p1', 'esc')
  assert.equal(failed.status, 502)
  assert.deepEqual(logs.map((x) => x.result), ['invalid', 'failed'])
})
