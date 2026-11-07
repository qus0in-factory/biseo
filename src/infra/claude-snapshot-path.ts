import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { logger } from './logger.js'
import { snapshotDefaultPath } from './claude-snapshot-default.js'

export type SnapshotDisabledReason = 'config_unreadable'
const str = (v: unknown) => typeof v === 'string' && v.trim() ? v : undefined
let warned = false

export function claudeSnapshotPath(
  cfg = resolve(process.cwd(), 'config/claude-oauth.json'),
  warn = (reason: SnapshotDisabledReason) => logger.warn({ reason, config: cfg }, 'claude.snapshot.disabled'),
): string {
  const env = str(process.env.BISEO_CLAUDE_SNAPSHOT_PATH)
  if (env) return resolve(env)
  try {
    const p = str(JSON.parse(readFileSync(cfg, 'utf8'))?.snapshotPath)
    if (p) return resolve(p)
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT' && !warned) {
      warned = true
      warn('config_unreadable')
    }
  }
  return snapshotDefaultPath()
}
