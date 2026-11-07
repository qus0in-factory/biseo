import type { ProviderUsage } from '../domain/usage-types.js'
import { claudeBackoffCfg } from './claude-oauth-config.js'
import { claudeBackoffHit } from './claude-oauth-gate.js'
import { fetchClaudeUsage } from './claude-oauth-fetch.js'
import { readClaudeUsage } from './claude-usage-read.js'

let inflight: Promise<ProviderUsage> | null = null
let nextAt = 0
type Load = (now: Date) => Promise<ProviderUsage>

export function resetClaudeRefresh(): void {
  inflight = null
  nextAt = 0
}

export function refreshClaudeUsage(now = new Date(), load: Load = fetchClaudeUsage): Promise<ProviderUsage> {
  if (inflight) return inflight
  if (now.getTime() < nextAt || claudeBackoffHit(now)) return Promise.resolve(readClaudeUsage(now))
  nextAt = now.getTime() + claudeBackoffCfg().initialMs
  inflight = load(now).finally(() => { inflight = null })
  return inflight
}
