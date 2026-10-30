import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { parseClaudeUsage } from './claude-oauth-parse.js'

export function claudeHttpUsage(status: number, headers: Headers, data: unknown, now = new Date()): ProviderUsage {
  if (status === 200) return parseClaudeUsage(data, now)
  if (status === 429) {
    const raw = headers.get('retry-after')
    const sec = raw && /^\d+$/.test(raw) ? Number(raw) : null
    const retryAt = sec === null ? undefined : new Date(now.getTime() + sec * 1000).toISOString()
    return unknownUsage('claude', 'rate_limited', retryAt)
  }
  if (status === 401 || status === 403) return unknownUsage('claude', 'auth_failed')
  return unknownUsage('claude', 'upstream_error')
}
