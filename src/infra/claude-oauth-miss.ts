import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { resolveClaude } from './claude-snapshot-store.js'

export function claudeMiss(now: Date, reason?: string): ProviderUsage {
  return resolveClaude(now, unknownUsage('claude', reason))
}
