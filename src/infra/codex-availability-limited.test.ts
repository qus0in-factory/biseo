import test from 'node:test'
import assert from 'node:assert/strict'
import { fresh, future, now, readAvailability } from './codex-availability-fixture.test.js'
import { limitedRate, token } from './codex-rate-fixture.test.js'

test('codex rollout limited snapshot is mapped without raw text', async () => {
  const a = await readAvailability([
    '{"type":"session_meta","payload":{"cwd":"/tmp"}}',
    token(limitedRate()),
  ])
  assert.equal(a.state, 'limited')
  assert.equal(a.window, 'primary')
  assert.equal(a.resetsAt, future)
  assert.equal(a.source, 'codex')
  assert.equal(a.checkedAt, fresh)
  assert.equal(a.observedAt, now.toISOString())
  assert.doesNotMatch(JSON.stringify(a), /SECRET/)
})
