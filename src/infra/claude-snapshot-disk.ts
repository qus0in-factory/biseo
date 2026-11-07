import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import type { ProviderUsage } from '../domain/usage-types.js'
import { claudeSnapshotPath } from './claude-snapshot-path.js'

export function readClaudeSnapshot(): ProviderUsage | null {
  const path = claudeSnapshotPath()
  if (!path) return null
  try {
    const u = JSON.parse(readFileSync(path, 'utf8'))
    return u.provider === 'claude' && ['available', 'limited'].includes(u.state) &&
      Array.isArray(u.windows) && Array.isArray(u.metrics) ? u : null
  } catch { return null }
}

export function writeClaudeSnapshot(u: ProviderUsage): void {
  const path = claudeSnapshotPath()
  if (!path) return
  try {
    mkdirSync(dirname(path), { recursive: true, mode: 0o700 })
    writeFileSync(`${path}.tmp`, JSON.stringify(u), { mode: 0o600 })
    renameSync(`${path}.tmp`, path)
  } catch { /* Persistence failure must not hide a successful API response. */ }
}
