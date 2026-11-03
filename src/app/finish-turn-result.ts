import { finish } from './finish-turn-record.js'
import { turnBlockedError } from './turn-blocked-error.js'
import type { CaptureTurnDeps } from './capture-turn-deps.js'
import type { TimelineItem, TurnStatus } from '../domain/timeline.js'
export async function finishTurnResult(d: CaptureTurnDeps, item: TimelineItem, r: { status: TurnStatus; errorCode: string }) {
  const error = r.status === 'blocked'
    ? await turnBlockedError(d, item.paneId, await d.herdr.getAgent(item.paneId).catch(() => undefined))
    : r.errorCode
  return finish(d.store, item.requestId, r.status, error)
}
