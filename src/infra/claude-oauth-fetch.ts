import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { getUsageEndpoints, getUsageTimeoutMs } from '../domain/usage-endpoints.js'
import { claudeHttpUsage } from './claude-oauth-http.js'
import { readClaudeToken } from './claude-oauth-token.js'
import { resolveClaude } from './claude-snapshot-store.js'

export async function fetchClaudeUsage(now = new Date()): Promise<ProviderUsage> {
  try {
    const t = await readClaudeToken()
    if (!t) return resolveClaude(now, unknownUsage('claude', 'auth_required'))
    const h = { Authorization: `Bearer ${t}`, 'anthropic-beta': 'oauth-2025-04-20', Accept: 'application/json' }
    const res = await fetch(getUsageEndpoints().claude, { headers: h, signal: AbortSignal.timeout(getUsageTimeoutMs()) })
    const d = await res.json().catch(() => null)
    return resolveClaude(now, claudeHttpUsage(res.status, res.headers, d, now))
  } catch {
    return resolveClaude(now, unknownUsage('claude'))
  }
}
