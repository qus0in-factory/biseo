import { normalizeInterruptKey } from '../domain/interrupt-key.js'
import { isSafePaneId } from '../domain/pane-id.js'
import { interruptAudit } from './interrupt-audit.js'
import { interruptSend } from './interrupt-send.js'
import { interruptTarget } from './interrupt-target.js'
import type { InterruptDeps } from './interrupt-types.js'

export async function interruptPane(d: InterruptDeps, paneId: string, rawKey: unknown) {
  const key = normalizeInterruptKey(rawKey)
  if (!isSafePaneId(paneId) || !key) {
    interruptAudit(d.audit, paneId, key ?? 'invalid', 'invalid')
    return { status: 400 as const, body: { error: 'bad_request', reason: 'key_not_allowed' } }
  }
  const target = await interruptTarget(d, paneId, key)
  if (!('pane' in target)) return target
  return interruptSend(d, target.pane, paneId, key)
}
