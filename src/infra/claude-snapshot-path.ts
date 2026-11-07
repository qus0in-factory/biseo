import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export function claudeSnapshotPath(): string {
  const config = JSON.parse(readFileSync(resolve('config/claude-oauth.json'), 'utf8'))
  return resolve(process.env.BISEO_CLAUDE_SNAPSHOT_PATH ?? config.snapshotPath)
}
