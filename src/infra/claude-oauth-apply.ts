import type { ProviderUsage } from '../domain/usage-types.js'
import { claudeHttpUsage } from './claude-oauth-http.js'
import { resolveClaude } from './claude-snapshot-store.js'
import { claudeAfterOk } from './claude-oauth-gate.js'

export function applyClaudeHttp(now: Date, status: number, data: unknown): ProviderUsage {
  const usage = resolveClaude(now, claudeHttpUsage(status, new Headers(), data, now))
  if (status === 200 && usage.state !== 'unknown') claudeAfterOk()
  return usage
}
