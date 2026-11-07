import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { resolveClaude } from './claude-snapshot-store.js'
import { claudeBackoffAt, claudeBackoffOpen, noteClaudeFail, noteClaudeOk } from './claude-oauth-backoff.js'
import { logClaude429 } from './claude-oauth-log.js'

function held(now: Date, retryAt: string): ProviderUsage {
  return resolveClaude(now, unknownUsage('claude', 'rate_limited', retryAt))
}

export function claudeBackoffHit(now: Date): ProviderUsage | null {
  if (!claudeBackoffOpen(now.getTime())) return null
  return held(now, claudeBackoffAt())
}

export function claudeAfter429(now: Date, status: number, retryAfter: string | null): ProviderUsage {
  logClaude429(status, retryAfter)
  return held(now, new Date(noteClaudeFail(now.getTime())).toISOString())
}

export function claudeAfterOk(): void {
  noteClaudeOk()
}
