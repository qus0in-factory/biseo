import { claudeBackoffHit } from './claude-oauth-gate.js'
import { claudeMiss } from './claude-oauth-miss.js'
import { cachedClaude } from './claude-snapshot-store.js'
import { staleClaude } from './claude-snapshot-stale.js'
import { claudePoll } from './claude-usage-cache.js'
import { openClaude } from './claude-usage-open.js'

export async function readClaudeUsage(now = new Date()) {
  const hit = claudeBackoffHit(now)
  if (hit) return hit
  const latest = claudePoll()
  const snap = cachedClaude()
  if (latest?.state === 'unknown') {
    return openClaude(snap ? staleClaude(snap, latest, now) : latest, now)
  }
  const base = latest ?? snap
  return base ? openClaude(base, now) : claudeMiss(now)
}
