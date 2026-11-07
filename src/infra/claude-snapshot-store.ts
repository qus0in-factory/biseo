import type { ProviderUsage } from '../domain/usage-types.js'
import { readClaudeSnapshot, writeClaudeSnapshot } from './claude-snapshot-disk.js'
import { staleClaude } from './claude-snapshot-stale.js'

let last: ProviderUsage | null | undefined

export const setLastClaudeSnapshot = (u: ProviderUsage | null, _at = Date.now()): void => {
  last = u
}

export function resolveClaude(now: Date, fresh: ProviderUsage): ProviderUsage {
  if (fresh.state !== 'unknown') {
    last = fresh
    writeClaudeSnapshot(fresh)
    return fresh
  }
  if (last === undefined) last = readClaudeSnapshot()
  return last ? staleClaude(last, fresh, now) : fresh
}
