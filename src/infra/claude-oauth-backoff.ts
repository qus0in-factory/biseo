import { claudeBackoffCfg, type ClaudeBackoffCfg } from './claude-oauth-config.js'
import { dateMs } from './claude-date-range.js'

let fails = 0
let until = 0

export function resetClaudeBackoff(): void {
  fails = 0
  until = 0
}

export function claudeBackoffOpen(now: number): boolean {
  return now < until
}

export function claudeBackoffAt(): string {
  return new Date(until).toISOString()
}

export function noteClaudeFail(now: number, cfg: ClaudeBackoffCfg = claudeBackoffCfg(), retryMs = 0): number {
  now = dateMs(now)
  if (now < until) return until
  const ms = Math.min(cfg.maxMs, Math.max(retryMs, cfg.initialMs * cfg.factor ** fails))
  fails += 1
  until = dateMs(now + ms)
  return until
}

export function noteClaudeOk(): void {
  resetClaudeBackoff()
}
