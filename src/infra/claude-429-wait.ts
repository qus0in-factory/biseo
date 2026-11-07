import { claudeBackoffCfg } from './claude-oauth-config.js'
import { noteClaudeFail } from './claude-oauth-backoff.js'
import { claudeFloorMs } from './claude-oauth-floor.js'

export function claudeFailUntil(now: number, retryMs: number): number {
  if (retryMs > 0) return noteClaudeFail(now, undefined, retryMs)
  const floor = claudeFloorMs()
  const cfg = claudeBackoffCfg()
  return noteClaudeFail(now, { ...cfg, maxMs: Math.max(cfg.maxMs, floor) }, floor)
}
