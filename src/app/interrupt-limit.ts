import { normalizeAvailability } from '../domain/availability.js'
import { interruptAudit } from './interrupt-audit.js'
import type { InterruptDeps, InterruptFail } from './interrupt-types.js'
import type { PaneInfo } from '../domain/herdr.js'

export async function interruptLimit(
  d: InterruptDeps,
  pane: PaneInfo,
  paneId: string,
  key: string,
): Promise<InterruptFail | undefined> {
  const session = pane.agent_session ?? undefined
  const raw = d.availability ? await d.availability.get(session).catch(() => undefined) : undefined
  const av = raw ? normalizeAvailability(raw) : undefined
  if (av?.state !== 'limited') return undefined
  interruptAudit(d.audit, paneId, key, 'limited')
  return {
    status: 409,
    body: {
      error: 'target_not_ready',
      reason: 'usage_limited',
      ...(av.resetsAt ? { resetsAt: av.resetsAt } : {}),
    },
  }
}
