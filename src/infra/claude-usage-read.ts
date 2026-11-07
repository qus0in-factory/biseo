import type { ProviderUsage } from '../domain/usage-types.js'
import { claudeBackoffHit } from './claude-oauth-gate.js'
import { claudeMiss } from './claude-oauth-miss.js'
import { cachedClaude } from './claude-snapshot-store.js'

export async function readClaudeUsage(now = new Date()): Promise<ProviderUsage> {
  return claudeBackoffHit(now) ?? cachedClaude() ?? claudeMiss(now)
}
