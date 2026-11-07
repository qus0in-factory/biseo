import type { ProviderUsage } from '../domain/usage-types.js'
import { claudeHttpUsage } from './claude-oauth-http.js'
import { resolveClaude } from './claude-snapshot-store.js'
import { claudeAfterOk } from './claude-oauth-gate.js'

export function applyClaudeHttp(now: Date, status: number, data: unknown): ProviderUsage {
  if (status === 200) claudeAfterOk()
  return resolveClaude(now, claudeHttpUsage(status, new Headers(), data, now))
}
