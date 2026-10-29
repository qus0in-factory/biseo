import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { findRollout } from './codex-find.js'
import { createAvailability } from './codex-availability.js'
import type { AgentSession } from '../domain/herdr.js'

const id = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee'
const linkId = 'bbbbbbbb-cccc-4ddd-8eee-ffffffffffff'
const dirId = 'cccccccc-dddd-4eee-8fff-000000000000'
const now = new Date('2026-10-29T10:00:00.000Z')

test('rollout lookup requires a UUID and stays under the real root', async () => {
  const root = await mkdtemp(join(tmpdir(), 'biseo-path-'))
  const outside = await mkdtemp(join(tmpdir(), 'biseo-out-'))
  const prev = process.env.BISEO_CODEX_DIR
  try {
    const sub = join(root, '2026', '10', '29')
    await mkdir(sub, { recursive: true })
    const file = join(sub, `rollout-x-${id}.jsonl`)
    await writeFile(file, '')
    const secret = join(outside, 'secret.jsonl')
    const token = {
      type: 'event_msg',
      payload: {
        type: 'token_count',
        rate_limits: {
          primary: { resets_at: '2026-10-29T11:00:00.000Z' },
          rate_limit_reached_type: 'primary',
        },
      },
    }
    await writeFile(secret, JSON.stringify(token))
    await symlink(secret, join(sub, `rollout-x-${linkId}.jsonl`))
    await mkdir(join(sub, `rollout-x-${dirId}.jsonl`))
    process.env.BISEO_CODEX_DIR = root

    assert.equal(await findRollout(id), file)
    assert.equal(await findRollout(linkId), null)
    assert.equal(await findRollout(dirId), null)
    assert.equal(await findRollout(`../${id}`), null)
    assert.equal(await findRollout(`${id}/../../etc/passwd`), null)

    const session: AgentSession = {
      source: 'herdr:codex',
      agent: 'codex',
      kind: 'id',
      value: linkId,
    }
    assert.equal((await createAvailability().get(session, now)).state, 'unknown')
    assert.equal(
      (await createAvailability().get({ ...session, value: '../../etc/passwd' }, now))
        .state,
      'unknown',
    )
  } finally {
    if (prev === undefined) delete process.env.BISEO_CODEX_DIR
    else process.env.BISEO_CODEX_DIR = prev
    await rm(root, { recursive: true, force: true })
    await rm(outside, { recursive: true, force: true })
  }
})
