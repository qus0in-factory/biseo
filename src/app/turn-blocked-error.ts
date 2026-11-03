import { paneBlocked } from './pane-blocked.js'
import { lookupAvailability } from './availability-lookup.js'
import type { AvailabilityPort } from './ports.js'
import type { AgentInfo } from '../domain/herdr.js'
import type { LimitScreen } from './limit-screen.js'
export type BlockedDeps = { availability?: AvailabilityPort; input?: LimitScreen; limit?: LimitScreen }
export async function turnBlockedError(d: BlockedDeps, id: string, agent?: AgentInfo) {
  const a = await lookupAvailability(d.availability, agent?.agent_session ?? undefined, new Date())
  const limit = await d.limit?.classify(id).catch(() => false) ?? false
  const input = await d.input?.classify(id).catch(() => false) ?? false
  return paneBlocked({ status: 'blocked' }, a, limit, input) === 'input_request'
    ? 'input_request' : 'agent_blocked'
}
