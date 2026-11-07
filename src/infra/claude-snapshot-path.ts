import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { logger } from './logger.js'

export type SnapshotDisabledReason = 'snapshot_path_missing' | 'config_unreadable'
const str = (v: unknown) => typeof v === 'string' && v.trim() ? v : undefined
let warned = false

/** Returns null (and warns once) when no snapshot path is configured, so non-persistence is visible. */
export function claudeSnapshotPath(
  cfg = resolve(process.cwd(), 'config/claude-oauth.json'),
  warn = (reason: SnapshotDisabledReason) => logger.warn({ reason, config: cfg }, 'claude.snapshot.disabled'),
): string | null {
  const env = str(process.env.BISEO_CLAUDE_SNAPSHOT_PATH)
  if (env) return resolve(env)
  let reason: SnapshotDisabledReason = 'snapshot_path_missing'
  try {
    const p = str(JSON.parse(readFileSync(cfg, 'utf8'))?.snapshotPath)
    if (p) return resolve(p)
  } catch { reason = 'config_unreadable' }
  if (!warned) { warned = true; warn(reason) }
  return null
}
