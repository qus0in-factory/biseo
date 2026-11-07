import type { ProviderUsage } from '../domain/usage-types.js'
import { held } from './claude-rate-limited.js'
import { claudeBackoffAt, claudeBackoffOpen, noteClaudeFail, noteClaudeOk } from './claude-oauth-backoff.js'
import { logClaude429 } from './claude-oauth-log.js'
import { claudeRetryAfter } from './claude-retry-after.js'
import { dateMs } from './claude-date-range.js'

export function claudeBackoffHit(now: Date): ProviderUsage | null {
  if (!claudeBackoffOpen(now.getTime())) return null
  return held(now, claudeBackoffAt())
}

export function claudeAfter429(now: Date, status: number, raw: string | null) {
  now = new Date(dateMs(now.getTime()))
  logClaude429(status, raw)
  const until = noteClaudeFail(now.getTime(), undefined, claudeRetryAfter(raw, now.getTime()))
  return held(now, new Date(until).toISOString())
}

export function claudeAfterOk(): void {
  noteClaudeOk()
}
