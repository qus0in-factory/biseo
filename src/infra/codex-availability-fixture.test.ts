import type { Availability } from '../domain/timeline.js'
import type { AgentSession } from '../domain/herdr.js'
import { createAvailability } from './codex-availability.js'
import { id, withDir } from './codex-rollout-fixture.test.js'
export const session: AgentSession = { source: 'herdr:codex', agent: 'codex', kind: 'id', value: id }
export const now = new Date('2026-10-29T10:00:00.000Z')
export const ttl = 15 * 60 * 1000
export const fresh = '2026-10-29T09:58:00.000Z'
export const old = '2026-10-29T09:00:00.000Z'
export const future = '2026-10-29T11:00:00.000Z'
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
