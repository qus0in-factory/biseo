import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { parseClaudeUsage } from './claude-oauth-parse.js'
import { claudeAfter429 } from './claude-oauth-gate.js'

export function claudeHttpUsage(status: number, headers: Headers, data: unknown, now = new Date()): ProviderUsage {
  if (status === 200) return parseClaudeUsage(data, now)
  if (status === 429) {
    return claudeAfter429(now, status, headers.get('retry-after'))
  }
  if (status === 401 || status === 403) return unknownUsage('claude', 'auth_required')
  return unknownUsage('claude', 'upstream_error')
}
