import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createAvailability } from './codex-availability.js'
import type { AgentSession } from '../domain/herdr.js'

const id = '11111111-2222-4333-8444-555555555555'
const session: AgentSession = { source: 'herdr:codex', agent: 'codex', kind: 'id', value: id }
const now = new Date('2026-10-29T10:00:00.000Z')

async function fixture(lines: string[]) {
  const dir = await mkdtemp(join(tmpdir(), 'biseo-av-'))
  const sub = join(dir, '2026', '10', '29')
  await mkdir(sub, { recursive: true })
  await writeFile(join(sub, `rollout-2026-10-29T10-00-00-${id}.jsonl`), lines.join('\n'))
  return dir
}

async function withDir(lines: string[], run: () => Promise<void>) {
  const prev = process.env.BISEO_CODEX_DIR
  process.env.BISEO_CODEX_DIR = await fixture(lines)
  try {
    await run()
  } finally {
    if (prev === undefined) delete process.env.BISEO_CODEX_DIR
    else process.env.BISEO_CODEX_DIR = prev
  }
}

const token = (rate: unknown, text = 'SECRET conversation') =>
  JSON.stringify({
    type: 'event_msg',
    payload: { type: 'token_count', rate_limits: rate, content: text },
  })

test('codex rollout limited snapshot is mapped without raw text', async () => {
  await withDir(
    [
      '{"type":"session_meta","payload":{"cwd":"/tmp"}}',
      token({
        primary: { used_percent: 99, resets_at: '2026-10-29T11:00:00.000Z' },
        secondary: null,
        rate_limit_reached_type: 'primary',
      }),
    ],
    async () => {
      const a = await createAvailability().get(session, now)
      assert.equal(a.state, 'limited')
      assert.equal(a.window, 'primary')
      assert.equal(a.resetsAt, '2026-10-29T11:00:00.000Z')
      assert.equal(a.source, 'codex')
      assert.doesNotMatch(JSON.stringify(a), /SECRET/)
    },
  )
})

test('expired or malformed snapshots do not block', async () => {
  await withDir(
    [
      token({
        primary: { resets_at: '2026-10-29T09:00:00.000Z' },
        rate_limit_reached_type: 'primary',
      }),
      '{broken',
    ],
    async () => {
      const a = await createAvailability().get(session, now)
      assert.equal(a.state, 'unknown')
    },
  )
})

test('a rollout without token_count is unknown', async () => {
  await withDir(['{"type":"session_meta","payload":{"cwd":"/tmp"}}'], async () => {
    const a = await createAvailability().get(session, now)
    assert.equal(a.state, 'unknown')
  })
})

test('non-codex sessions and missing files are unknown', async () => {
  const plain = await createAvailability().get(
    { ...session, source: 'herdr:claude' },
    now,
  )
  assert.equal(plain.state, 'unknown')
  assert.equal(plain.source, null)
  await withDir([token({ rate_limit_reached_type: null })], async () => {
    const missing = await createAvailability().get(
      { ...session, value: '99999999-2222-4333-8444-555555555555' },
      now,
    )
    assert.equal(missing.state, 'unknown')
  })
})
