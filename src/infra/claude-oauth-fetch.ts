import type { ProviderUsage } from '../domain/usage-types.js'
import { readClaudeToken } from './claude-oauth-token.js'
import { requestClaudeUsage } from './claude-oauth-request.js'
import { claudeAfter429, claudeBackoffHit } from './claude-oauth-gate.js'
import { claudeMiss } from './claude-oauth-miss.js'
import { applyClaudeHttp } from './claude-oauth-apply.js'

export async function fetchClaudeUsage(now = new Date()): Promise<ProviderUsage> {
  const hit = claudeBackoffHit(now)
  if (hit) return hit
  try {
    const t = await readClaudeToken()
    if (!t) return claudeMiss(now, 'auth_required')
    const r = await requestClaudeUsage(t)
    if (r.status === 429) return claudeAfter429(now, r.status, r.retryAfter)
    return applyClaudeHttp(now, r.status, r.data)
  } catch {
    return claudeMiss(now)
  }
}
