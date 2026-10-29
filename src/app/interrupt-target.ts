import { interruptAudit } from './interrupt-audit.js'
import { interruptLimit } from './interrupt-limit.js'
import { interruptLookup } from './interrupt-lookup.js'
import type { InterruptDeps, InterruptFail } from './interrupt-types.js'
import type { PaneInfo } from '../domain/herdr.js'

export async function interruptTarget(
  d: InterruptDeps,
  paneId: string,
  key: string,
): Promise<{ pane: PaneInfo } | InterruptFail> {
  const target = await interruptLookup(d, paneId, key)
  if (!('pane' in target)) return target
  const limited = await interruptLimit(d, target.pane, paneId, key)
  if (limited) return limited
  // Point-in-time only: a pane/agent swap before sendKeys remains (no atomic compare).
  if (target.pane.agent_status !== 'blocked') {
    interruptAudit(d.audit, paneId, key, 'not_blocked')
    return { status: 409, body: { error: 'target_not_ready', reason: 'pane_not_blocked' } }
  }
  return target
}
