import { normalizeAvailability, unknownAvailability } from '../domain/availability.js'
import type { AvailabilityPort } from './ports.js'
import type { AgentSession } from '../domain/herdr.js'
import type { Availability } from '../domain/timeline.js'

export async function lookupAvailability(
  av: AvailabilityPort | undefined,
  session: AgentSession | undefined,
  now: Date,
): Promise<Availability> {
  const v = av ? await av.get(session, now).catch(() => unknownAvailability(now)) : unknownAvailability(now)
  return normalizeAvailability(v, now)
}
