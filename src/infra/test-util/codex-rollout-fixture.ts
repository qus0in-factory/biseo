import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Availability } from '../../domain/timeline.js'
import type { AgentSession } from '../../domain/herdr.js'
import { createAvailability } from '../codex-availability.js'

export const id = '11111111-2222-4333-8444-555555555555'
async function fixture(lines: string[]) {
  const dir = await mkdtemp(join(tmpdir(), 'biseo-av-'))
  const sub = join(dir, '2026', '10', '29')
  await mkdir(sub, { recursive: true })
  await writeFile(join(sub, `rollout-2026-10-29T10-00-00-${id}.jsonl`), lines.join('\n'))
  return dir
}
export async function withDir(lines: string[], run: () => Promise<void>) {
  const prev = process.env.BISEO_CODEX_DIR
  process.env.BISEO_CODEX_DIR = await fixture(lines)
  try {
    await run()
  } finally {
    if (prev === undefined) delete process.env.BISEO_CODEX_DIR
    else process.env.BISEO_CODEX_DIR = prev
  }
}

export const now = new Date('2026-10-29T10:00:00.000Z')
export const ttl = 15 * 60 * 1000
export const fresh = '2026-10-29T09:58:00.000Z'
export const old = '2026-10-29T09:00:00.000Z'
export const future = '2026-10-29T11:00:00.000Z'
export const session: AgentSession = { source: 'herdr:codex', agent: 'codex', kind: 'id', value: id }
export const readAvailability = async (
  lines: string[],
  target: AgentSession = session,
): Promise<Availability> => {
  let result: Availability | null = null
  await withDir(lines, async () => {
    result = await createAvailability(ttl).get(target, now)
  })
  if (!result) throw new Error('no availability result')
  return result
}

export const limitedRate = () => ({
  primary: { used_percent: 99, resets_at: future },
  secondary: null,
  rate_limit_reached_type: 'primary',
})
export const freeRate = () => ({
  primary: { used_percent: 10, resets_at: future },
  secondary: null,
  rate_limit_reached_type: null,
})
export const elapsedRate = () => ({
  primary: { resets_at: old },
  rate_limit_reached_type: 'primary',
})
export const token = (rate: unknown, at: string | null = fresh, text = 'SECRET conversation') =>
  JSON.stringify({
    timestamp: at,
    type: 'event_msg',
    payload: { type: 'token_count', rate_limits: rate, content: text },
  })

export const line = (rate: unknown, at: unknown = '2026-10-29T10:00:00.000Z') =>
  JSON.stringify({
    timestamp: at,
    type: 'event_msg',
    payload: { type: 'token_count', rate_limits: rate, message: 'SECRET body' },
  })
